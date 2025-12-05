import envConfig from "../config/env.config.js";
import { RepositoryFactory } from "../core/factories/RepositoryFactory.js";
import { producer } from "../lib/kafkaClient.js";
import { Comment } from "../models/comment.model.js";
import { CommentRepository } from "../repositories/comment.repository.js";
import { PostRepository } from "../repositories/post.repository.js";
import { redis } from "../shared/middlewares/cache.middleware.js";
import { createCommentCreatedEvent } from "../shared/utils/eventHelper.js";

export class CommentService {
  private commentRepo;
  private postRepo;
  private repoFactory = new RepositoryFactory();

  constructor() {
    this.commentRepo = this.repoFactory.createRepository(
      "Comment",
    ) as CommentRepository;
    this.postRepo = this.repoFactory.createRepository("Post") as PostRepository;
  }

  async getAllComments(currentUserId: number, post_id: number): Promise<Comment[]> {
    const comments = await this.commentRepo.findAll(currentUserId, post_id);
    const userIds = [...new Set(comments.map(c => c.author_id))];

    // Fetch enriched info (cached)
    const users = await this.getUsersInfo(userIds);

    const enriched = comments.map(c => ({
      ...c,
      author: users[c.author_id] ?? null,
    }));
    return enriched
  }

  async getAllCommentsReplies(currentUserId: number, comment_id: number): Promise<Comment[]> {
    const comments = await this.commentRepo.findAllReplies(currentUserId, comment_id);
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
    const comment = await this.commentRepo.create(commentData);
    const userId = comment.author_id;

    // Fetch author info
    const users = await this.getUsersInfo([userId]);
    const author = users[userId] ?? null;

    // Enrich comment with author info
    const enrichedComment = {
      ...comment,
      author,
    }

    // Determine ownerUserId
    let ownerUserId: number;

    if (comment.parent_comment_id) {
      // Reply comment → notify parent comment author
      const parent = await this.commentRepo.findOne(comment.parent_comment_id);
      ownerUserId = parent?.author_id ?? 0;
    } else {
      // Root comment → notify post owner
      const post = await this.postRepo.findOne(comment.post_id);
      ownerUserId = post?.author_id ?? 0;
    }

    if (ownerUserId !== userId) {
      // Don't send notification to self actions
      // (e.g., when user comments on their own post)
      // Build event envelope
      const eventEnvelope = createCommentCreatedEvent({ comment, author, ownerUserId })

      // Send notification to post author or parent comment author
      await producer.send({
        topic: "post.comment-created.v1",
        messages: [{ key: `comment_${comment.id}_created`, value: JSON.stringify(eventEnvelope) }],
      });
    }

    return enrichedComment;
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
