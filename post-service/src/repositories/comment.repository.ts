import { PostgresClient } from "../core/database/PostgresClient.js";
import { Comment } from "../models/comment.model.js";

export class CommentRepository {
  private db = PostgresClient.getInstance();

  async findAll(currentUserId: number, post_id: number): Promise<Comment[]> {
    const res = await this.db.query(
      `
      SELECT 
        c.*,
        COALESCE(v.vote_type, 0) AS my_vote
      FROM comments c
      LEFT JOIN LATERAL (
        SELECT vote_type
        FROM votes
        WHERE user_id = $2
          AND comment_id = c.id
        LIMIT 1
      ) v ON TRUE
      WHERE c.post_id = $1 
        AND c.parent_comment_id IS NULL 
        AND c.is_deleted = FALSE
      ORDER BY c.created_at ASC
      `,
      [post_id, currentUserId],
    );
    return res.rows;
  }

  async findAllReplies(currentUserId: number, comment_id: number): Promise<Comment[]> {
    const res = await this.db.query(
      `
      SELECT 
        c.*,
        COALESCE(v.vote_type, 0) AS my_vote
      FROM comments c
      LEFT JOIN LATERAL (
        SELECT vote_type
        FROM votes
        WHERE user_id = $2
          AND comment_id = c.id
        LIMIT 1
      ) v ON TRUE
      WHERE c.parent_comment_id = $1
        AND c.is_deleted = FALSE
      ORDER BY c.created_at ASC
      `,
      [comment_id, currentUserId],
    );
    return res.rows;
  }

  async findOne(id: number): Promise<Comment | null> {
    const res = await this.db.query(`SELECT * FROM comments WHERE id = $1`, [id]);
    return res.rows[0] || null;
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
