import { PostgresClient } from "../core/database/PostgresClient";

export class PostMediaRepository {
  private db = PostgresClient.getInstance();

  async createMany(postId: number, mediaList: { url: string; type: string }[]) {
    const query = `
      INSERT INTO post_media (post_id, media_url, media_type)
      VALUES ${mediaList.map((_, i) => `($1, $${i * 2 + 2}, $${i * 2 + 3})`).join(", ")}
      RETURNING *`;
    const values = [postId, ...mediaList.flatMap((m) => [m.url, m.type])];
    const result = await this.db.query(query, values);
    return result.rows;
  }

  async getByPostIds(postIds: number[]): Promise<any[]> {
    const result = await this.db.query(
      `SELECT * FROM post_media WHERE post_id = ANY($1)`,
      [postIds],
    );
    return result.rows;
  }

  async getByPostId(postId: number): Promise<any[]> {
    const result = await this.db.query(
      `SELECT * FROM post_media WHERE post_id = $1`,
      [postId],
    );
    return result.rows;
  }
}
