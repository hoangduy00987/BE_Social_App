import { PostgresClient } from "../core/database/PostgresClient.js";
import { SavedPost } from "../models/saved-post.model.js";

export class SavedPostRepository {
  private db = PostgresClient.getInstance();

  async create(data: Partial<SavedPost>): Promise<SavedPost> {
    const res = await this.db.query(
      `INSERT INTO saved_posts (user_id, post_id) 
       VALUES ($1, $2) 
       RETURNING *`,
      [data.user_id, data.post_id],
    );
    return res.rows[0];
  }

  async delete(data: Partial<SavedPost>): Promise<void> {
    await this.db.query(
      `DELETE FROM saved_posts WHERE user_id = $1 AND post_id = $2`,
      [data.user_id, data.post_id],
    );
  }

  async findAll(data: Partial<SavedPost>): Promise<SavedPost[]> {
    const res = await this.db.query(
      `SELECT * FROM saved_posts WHERE user_id = $1`,
      [data.user_id],
    );
    return res.rows;
  }

  async findOne(data: Partial<SavedPost>): Promise<SavedPost | null> {
    const res = await this.db.query(
      `SELECT * FROM saved_posts WHERE user_id = $1 AND post_id = $2`,
      [data.user_id, data.post_id],
    );
    return res.rows[0] || null;
  }
}
