import { RepositoryFactory } from "../core/factories/RepositoryFactory.js";
import { Comment } from "../models/comment.model.js";
import { CommentRepository } from "../repositories/comment.repository.js";

export class CommentService {
  private commentRepo;
  private repoFactory = new RepositoryFactory();

  constructor() {
    this.commentRepo = this.repoFactory.createRepository(
      "Comment",
    ) as CommentRepository;
  }

  async getAllComments(post_id: number): Promise<Comment[]> {
    return await this.commentRepo.findAll(post_id);
  }

  async getAllCommentsReplies(comment_id: number): Promise<Comment[]> {
    return await this.commentRepo.findAllReplies(comment_id);
  }

  async createComment(commentData: Partial<Comment>): Promise<Comment> {
    return await this.commentRepo.create(commentData);
  }

  async deleteComment(id: number): Promise<void> {
    return await this.commentRepo.delete(id);
  }
}
