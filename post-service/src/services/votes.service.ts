import { PostgresClient } from "../core/database/PostgresClient.js";
import { RepositoryFactory } from "../core/factories/RepositoryFactory.js";
import { Vote } from "../models/vote.model.js";
import { VoteRepository } from "../repositories/vote.repository.js";

export class VoteService {
  private voteRepo;
  private repoFactory = new RepositoryFactory();

  constructor() {
    this.voteRepo = this.repoFactory.createRepository("Vote") as VoteRepository;
  }

  async createVote(voteData: Partial<Vote>): Promise<Vote> {
    const db = PostgresClient.getInstance();

    const client = await db.connect();
    try {
      await client.query("BEGIN");

      if (voteData.comment_id) {
        await client.query(
          `DELETE FROM votes WHERE user_id = $1 AND post_id = $2 AND comment_id = $3`,
          [voteData.user_id, voteData.post_id, voteData.comment_id],
        );
        await client.query(
          `UPDATE comments SET vote_count = vote_count + $1, updated_at = NOW() WHERE id = $2`,
          [voteData.vote_type, voteData.comment_id],
        );
      } else {
        await client.query(
          `DELETE FROM votes WHERE user_id = $1 AND post_id = $2 AND comment_id IS NULL`,
          [voteData.user_id, voteData.post_id],
        );
        await client.query(
          `UPDATE posts SET vote_count = vote_count + $1, updated_at = NOW() WHERE id = $2`,
          [voteData.vote_type, voteData.post_id],
        );
      }

      const vote = await client.query(
        `INSERT INTO votes (user_id, post_id, comment_id, vote_type)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [
          voteData.user_id,
          voteData.post_id,
          voteData.comment_id || null,
          voteData.vote_type,
        ],
      );

      await client.query("COMMIT");
      return vote.rows[0];
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async deleteVote(voteData: Partial<Vote>): Promise<void> {
    const db = PostgresClient.getInstance();

    const client = await db.connect();
    try {
      await client.query("BEGIN");

      await client.query(
        `DELETE FROM votes WHERE user_id = $1 AND post_id = $2 AND comment_id = $3`,
        [voteData.user_id, voteData.post_id, voteData.comment_id],
      );

      await client.query(
        `UPDATE posts SET vote_count = vote_count + $1, updated_at = NOW() WHERE id = $2`,
        [voteData.vote_type, voteData.post_id],
      );

      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async getMyVote(voteData: Partial<Vote>): Promise<Vote | null> {
    return await this.voteRepo.findOne(voteData);
  }
}
