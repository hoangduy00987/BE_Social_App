import { Request, Response } from "express";
import { CommentService } from "../services/comments.service.js";

export class CommentController {
  private commentService: CommentService;

  constructor() {
    this.commentService = new CommentService();
  }

  fetchComments = async (req: Request, res: Response) => {
    const post_id = parseInt(req.query.post_id as string) || 0;
    const comments = await this.commentService.getAllComments(post_id);
    res.json(comments);
  };

  fetchCommentReplies = async (req: Request, res: Response) => {
    const comment_id = parseInt(req.query.comment_id as string) || 0;
    const comments =
      await this.commentService.getAllCommentsReplies(comment_id);
    res.json(comments);
  };

  createComment = async (req: Request, res: Response) => {
    const { post_id, content, parent_comment_id } = req.body;
    const author_id = req.user?.userId;
    const newComment = await this.commentService.createComment({
      post_id,
      author_id,
      content,
      parent_comment_id,
    });
    res.status(201).json(newComment);
  };

  deleteComment = async (req: Request, res: Response) => {
    const { comment_id } = req.body;
    await this.commentService.deleteComment(comment_id);
    res.status(204).send();
  };
}
