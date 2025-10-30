import slug from "slug";
import { RepositoryFactory } from "../core/factories/RepositoryFactory";
import { PostgresClient } from "../core/database/PostgresClient";
import { Post } from "../models/post.model";
import { PostRepository } from "../repositories/post.repository";
import { PostMedia } from "../models/post-media.model";
import { PostMediaRepository } from "../repositories/post-media.repository";
import { SavedPost } from "../models/saved-post.model";
import { SavedPostRepository } from "../repositories/saved-post.repository";

export class PostService {
  private postRepo;
  private postMediaRepo;
  private savedPostRepo;
  private repoFactory = new RepositoryFactory();

  constructor() {
    this.postRepo = this.repoFactory.createRepository("Post") as PostRepository;
    this.postMediaRepo = this.repoFactory.createRepository(
      "PostMedia",
    ) as PostMediaRepository;
    this.savedPostRepo = this.repoFactory.createRepository(
      "SavedPost",
    ) as SavedPostRepository;
  }

  async getAllPosts(
    limit: number = 10,
    offset: number = 0,
  ): Promise<{ posts: Post[]; hasMore: boolean }> {
    const result = await this.postRepo.findAll(limit, offset);
    const postIds = result.posts.map((p) => p.id);
    const media = await this.postMediaRepo.getByPostIds(postIds);

    const mediaMap = media.reduce((acc, m) => {
      acc[m.post_id] = acc[m.post_id] || [];
      acc[m.post_id].push(m);
      return acc;
    }, {});

    const mappedPosts = result.posts.map((p) => ({
      ...p,
      media: mediaMap[p.id] || [],
    }));

    return { ...result, posts: mappedPosts };
  }

  async getPostById(id: number): Promise<any | null> {
    const post = await this.postRepo.findById(id);
    const media = await this.postMediaRepo.getByPostId(id);

    const mediaMap = media.reduce((acc, m) => {
      acc[m.post_id] = acc[m.post_id] || [];
      acc[m.post_id].push(m);
      return acc;
    }, {});

    return post
      ? {
          ...post,
          media: mediaMap[post.id] || [],
        }
      : null;
  }

  async createPostWithMedia(postData: Partial<Post>, mediaList: PostMedia[]) {
    const db = PostgresClient.getInstance();

    const client = await db.connect(); // transaction
    try {
      await client.query("BEGIN");

      const post = await client.query(
        `INSERT INTO posts (author_id, subreddit_id, title, content, slug)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [
          postData.author_id,
          postData.subreddit_id || null,
          postData.title,
          postData.content,
          slug(postData.title || ""),
        ],
      );

      if (mediaList?.length) {
        for (const media of mediaList) {
          await client.query(
            `INSERT INTO post_media (post_id, media_url, media_type)
             VALUES ($1, $2, $3)`,
            [post.rows[0].id, media.media_url, media.media_type],
          );
        }
      }

      await client.query("COMMIT");
      return post.rows[0];
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async updatePost(id: number, data: Partial<Post>): Promise<Post> {
    return await this.postRepo.update(id, data);
  }

  async deletePost(id: number): Promise<void> {
    await this.postRepo.delete(id);
  }

  async createSavedPost(savedData: Partial<SavedPost>): Promise<SavedPost> {
    return await this.savedPostRepo.create(savedData);
  }

  async deleteSavedPost(savedData: Partial<SavedPost>): Promise<void> {
    await this.savedPostRepo.delete(savedData);
  }

  async getAllMySaved(savedData: Partial<SavedPost>): Promise<SavedPost[]> {
    return await this.savedPostRepo.findAll(savedData);
  }

  async getMySaved(savedData: Partial<SavedPost>): Promise<SavedPost | null> {
    return await this.savedPostRepo.findOne(savedData);
  }
}
