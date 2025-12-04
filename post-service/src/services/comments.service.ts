import envConfig from "../config/env.config.js";
import { RepositoryFactory } from "../core/factories/RepositoryFactory.js";
import { Comment } from "../models/comment.model.js";
import { CommentRepository } from "../repositories/comment.repository.js";
import { redis } from "../shared/middlewares/cache.middleware.js";

export class CommentService {
  private commentRepo;
  private repoFactory = new RepositoryFactory();

  constructor() {
    this.commentRepo = this.repoFactory.createRepository(
      "Comment",
    ) as CommentRepository;
  }

  async getAllComments(post_id: number): Promise<Comment[]> {
    const comments = await this.commentRepo.findAll(post_id);
    const userIds = [...new Set(comments.map(c => c.author_id))];

    // Fetch enriched info (cached)
    const users = await this.getUsersInfo(userIds);

    const enriched = comments.map(c => ({
      ...c,
      author: users[c.author_id] ?? null,
    }));
    return enriched
  }

  async getAllCommentsReplies(comment_id: number): Promise<Comment[]> {
    const comments = await this.commentRepo.findAllReplies(comment_id);
    const userIds = [...new Set(comments.map(c => c.author_id))];

    // Fetch enriched info (cached)
    const users = await this.getUsersInfo(userIds);

    const enriched = comments.map(c => ({
      ...c,
      author: users[c.author_id] ?? null,
    }));
    return enriched
  }

  async createComment(commentData: Partial<Comment>): Promise<Comment> {
    return await this.commentRepo.create(commentData);
  }

  async deleteComment(id: number): Promise<void> {
    return await this.commentRepo.delete(id);
  }

  async getUsersInfo(ids: number[]) {
    const cacheKey = `users:${ids.join(",")}`;
    const cached = await redis.get(cacheKey);

    if (cached) return JSON.parse(cached);

    const res = await fetch(`${envConfig.USER_SERVICE_URL}/users/batch`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    });

    const data = await res.json();

    await redis.set(cacheKey, JSON.stringify(data), "EX", 300); // TTL 5 phút

    return data;
  }
}
