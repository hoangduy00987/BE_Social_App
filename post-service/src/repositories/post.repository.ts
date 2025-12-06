import { Post } from "../models/post.model.js";
import { PostgresClient } from "../core/database/PostgresClient.js";

export class PostRepository {
  private db = PostgresClient.getInstance();

  async findAll(
    currentUserId: number,
    limit: number = 10,
    offset: number = 0,
  ): Promise<{ posts: Post[]; hasMore: boolean }> {
    const [posts, total] = await Promise.all([
      this.db.query(
        `
        SELECT 
          p.*, 
          COUNT(c.id) AS nr_of_comments,
          COALESCE(v.vote_type, 0) AS my_vote
        FROM posts p
        LEFT JOIN comments c 
          ON c.post_id = p.id 
          AND c.is_deleted = FALSE
        LEFT JOIN LATERAL (
          SELECT vote_type 
          FROM votes 
          WHERE votes.user_id = $3 
            AND votes.post_id = p.id 
            AND votes.comment_id IS NULL
          LIMIT 1
        ) v ON TRUE
        WHERE p.is_deleted = FALSE
        GROUP BY p.id, v.vote_type
        ORDER BY p.created_at DESC
        LIMIT $1 OFFSET $2
        `,
        [limit, offset, currentUserId],
      ),
      this.db.query("SELECT COUNT(*) FROM posts WHERE is_deleted = FALSE"),
    ]);

    return {
      posts: posts.rows,
      hasMore: offset + limit < parseInt(total.rows[0].count),
    };
  }

  async findById(currentUserId: number, id: number): Promise<Post | null> {
    const res = await this.db.query(
      `
      SELECT 
        p.*, 
        COUNT(c.id) AS nr_of_comments,
        COALESCE(v.vote_type, 0) AS my_vote
      FROM posts p
      LEFT JOIN comments c 
        ON c.post_id = p.id 
        AND c.is_deleted = FALSE
      LEFT JOIN LATERAL (
        SELECT vote_type 
        FROM votes 
        WHERE votes.user_id = $1 
          AND votes.post_id = p.id 
          AND votes.comment_id IS NULL
        LIMIT 1
      ) v ON TRUE
      WHERE p.id = $2 AND p.is_deleted = FALSE
      GROUP BY p.id, v.vote_type
      `,
      [currentUserId, id],
    );
    return res.rows[0] || null;
  }

  async findOne(id: number): Promise<Post | null> {
    const res = await this.db.query(`SELECT * FROM posts WHERE id = $1`, [id]);
    return res.rows[0] || null;
  }

  async create(data: Partial<Post>): Promise<Post> {
    const res = await this.db.query(
      `INSERT INTO posts (author_id, subreddit_id, title, content, slug)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [data.author_id, data.subreddit_id, data.title, data.content, data.slug],
    );
    return res.rows[0];
  }

  async update(id: number, data: Partial<Post>): Promise<Post> {
    const res = await this.db.query(
      `UPDATE posts SET title = $1, content = $2, updated_at = NOW() WHERE id = $3 RETURNING *`,
      [data.title, data.content, id],
    );
    return res.rows[0];
  }

  async delete(id: number): Promise<void> {
    await this.db.query("UPDATE posts SET is_deleted = TRUE WHERE id = $1", [
      id,
    ]);
  }

  async findBySlug(slug: string): Promise<Post | null> {
    const res = await this.db.query(`SELECT * FROM posts WHERE slug = $1`, [
      slug,
    ]);
    return res.rows[0] || null;
  }

  async findByAuthorId(author_id: number): Promise<Post[]> {
    const res = await this.db.query(
      `SELECT * FROM posts WHERE author_id = $1 AND is_deleted = FALSE ORDER BY created_at DESC`,
      [author_id],
    );
    return res.rows;
  }

  async updateVoteCount(postId: number, delta: number): Promise<void> {
    await this.db.query(
      `UPDATE posts SET vote_count = vote_count + $1, updated_at = NOW() WHERE id = $2`,
      [delta, postId],
    );
  }
}
