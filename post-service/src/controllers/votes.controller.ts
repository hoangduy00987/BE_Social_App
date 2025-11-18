import { Request, Response } from "express";
import { VoteService } from "../services/votes.service.js";

export class VoteController {
  private voteService: VoteService;

  constructor() {
    this.voteService = new VoteService();
  }

  createVote = async (req: Request, res: Response) => {
    const { post_id, comment_id, vote_type } = req.body;
    const user_id = req.user?.userId;
    const vote = await this.voteService.createVote({
      user_id,
      post_id,
      comment_id,
      vote_type,
    });
    res.status(201).json(vote);
  };

  deleteVote = async (req: Request, res: Response) => {
    const { post_id, comment_id, vote_type } = req.body;
    const user_id = req.user?.userId;
    await this.voteService.deleteVote({
      user_id,
      post_id,
      comment_id,
      vote_type,
    });
    res.status(204).send();
  };

  getMyVote = async (req: Request, res: Response) => {
    const { post_id, comment_id } = req.query;
    const user_id = req.user?.userId;
    const vote = await this.voteService.getMyVote({
      user_id,
      post_id: parseInt(post_id as string) || 0,
      comment_id: parseInt(comment_id as string) || 0,
    });
    res.json(vote);
  };
}
