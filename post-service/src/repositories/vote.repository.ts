import { PostgresClient } from "../core/database/PostgresClient";
import { Vote } from "../models/vote.model";

export class VoteRepository {
  private db = PostgresClient.getInstance();

  async create(data: Partial<Vote>): Promise<Vote> {
    const res = await this.db.query(
      `INSERT INTO votes (user_id, post_id, comment_id, vote_type)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [data.user_id, data.post_id, data.comment_id || null, data.vote_type],
    );
    return res.rows[0];
  }

  async delete(data: Partial<Vote>): Promise<void> {
    await this.db.query(
      `DELETE FROM votes WHERE user_id = $1 AND post_id = $2 AND comment_id = $3`,
      [data.user_id, data.post_id, data.comment_id],
    );
  }

  async findOne(data: Partial<Vote>): Promise<Vote | null> {
    let res;
    if (data.comment_id) {
      res = await this.db.query(
        `SELECT * FROM votes WHERE user_id = $1 AND post_id = $2 AND comment_id = $3`,
        [data.user_id, data.post_id, data.comment_id],
      );
    } else {
      res = await this.db.query(
        `SELECT * FROM votes WHERE user_id = $1 AND post_id = $2 AND comment_id IS NULL`,
        [data.user_id, data.post_id],
      );
    }

    return res.rows[0] || null;
  }
}
