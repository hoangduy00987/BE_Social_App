import slug from "slug";
import { RepositoryFactory } from "../core/factories/RepositoryFactory.js";
import { PostgresClient } from "../core/database/PostgresClient.js";
import { Post } from "../models/post.model.js";
import { PostRepository } from "../repositories/post.repository.js";
import { PostMedia } from "../models/post-media.model.js";
import { PostMediaRepository } from "../repositories/post-media.repository.js";
import { SavedPost } from "../models/saved-post.model.js";
import { SavedPostRepository } from "../repositories/saved-post.repository.js";
import { redis } from "../shared/middlewares/cache.middleware.js";
import envConfig from "../config/env.config.js";

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
    currentUserId: number,
    limit: number = 10,
    offset: number = 0,
  ): Promise<{ posts: Post[]; hasMore: boolean }> {
    const result = await this.postRepo.findAll(currentUserId, limit, offset);
    const postIds = result.posts.map((p) => p.id);
    const media = await this.postMediaRepo.getByPostIds(postIds);

    const userIds = [...new Set(result.posts.map(p => p.author_id))];
    const communityIds = [...new Set(result.posts.map(p => p.subreddit_id!))];

    // Fetch enriched info (cached)
    const [users, communities] = await Promise.all([
      this.getUsersInfo(userIds),
      this.getCommunitiesInfo(communityIds),
    ]);

    const enriched = result.posts.map(p => ({
      ...p,
      author: users[p.author_id] ?? null,
      community: communities[p.subreddit_id!] ?? null
    }));

    const mediaMap = media.reduce((acc, m) => {
      acc[m.post_id] = acc[m.post_id] || [];
      acc[m.post_id].push(m);
      return acc;
    }, {});

    const mappedPosts = enriched.map((p) => ({
      ...p,
      media: mediaMap[p.id] || [],
    }));

    return { ...result, posts: mappedPosts };
  }

  async getPostById(currentUserId: number, id: number): Promise<any | null> {
    const post = await this.postRepo.findById(currentUserId, id);
    const media = await this.postMediaRepo.getByPostId(id);

    if (!post) return null

    const userId = post.author_id;
    const communityId = post.subreddit_id;

    // Fetch enriched info (cached)
    const [users, communities] = await Promise.all([
      this.getUsersInfo([userId]),
      this.getCommunitiesInfo([communityId!]),
    ]);

    const enriched = {
      ...post,
      author: users[post.author_id] ?? null,
      community: communities[post.subreddit_id!] ?? null
    }

    const mediaMap = media.reduce((acc, m) => {
      acc[m.post_id] = acc[m.post_id] || [];
      acc[m.post_id].push(m);
      return acc;
    }, {});

    return {
      ...enriched,
      media: mediaMap[enriched.id] || [],
    }
  }

  async getUsersInfo(ids: number[]) {
    const cacheKey = `users:${ids.join(",")}`;
    const cached = await redis.get(cacheKey);

    if (cached) return JSON.parse(cached);

    const res = await fetch(`${envConfig.USER_SERVICE_URL}/users/batch`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    });

    const data = await res.json();

    await redis.set(cacheKey, JSON.stringify(data), "EX", 300); // TTL 5 phút

    return data;
  }

  async getCommunitiesInfo(ids: number[]) {
    const cacheKey = `communities:${ids.join(",")}`;
    const cached = await redis.get(cacheKey);

    if (cached) return JSON.parse(cached);

    const res = await fetch(`${envConfig.COMMUNITY_SERVICE_URL}/api/community/batch`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    });

    const data = await res.json();

    await redis.set(cacheKey, JSON.stringify(data), "EX", 300);

    return data;
  }

  async createPostWithMedia(postData: Partial<Post>, mediaList: Partial<PostMedia>[]) {
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
