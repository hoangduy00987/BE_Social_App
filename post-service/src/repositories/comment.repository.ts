import { PostgresClient } from "../core/database/PostgresClient";
import { Comment } from "../models/comment.model";

export class CommentRepository {
  private db = PostgresClient.getInstance();

  async findAll(post_id: number): Promise<Comment[]> {
    const res = await this.db.query(
      `SELECT * FROM comments WHERE post_id = $1 AND parent_comment_id IS NULL AND is_deleted = FALSE`,
      [post_id],
    );
    return res.rows;
  }

  async findAllReplies(comment_id: number): Promise<Comment[]> {
    const res = await this.db.query(
      `SELECT * FROM comments WHERE parent_comment_id = $1 AND is_deleted = FALSE`,
      [comment_id],
    );
    return res.rows;
  }

  async create(data: Partial<Comment>): Promise<Comment> {
    const res = await this.db.query(
      `INSERT INTO comments (post_id, author_id, content, parent_comment_id)
        VALUES ($1, $2, $3, $4) RETURNING *`,
      [
        data.post_id,
        data.author_id,
        data.content,
        data.parent_comment_id || null,
      ],
    );
    return res.rows[0];
  }

  async delete(id: number): Promise<void> {
    await this.db.query(`UPDATE comments SET is_deleted = TRUE WHERE id = $1`, [
      id,
    ]);
  }
}
