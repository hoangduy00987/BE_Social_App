import { Request, Response } from "express";
import { PostService } from "../services/posts.service.js";
import cloudinary from "../config/cloudinary.js";

export class PostController {
  private postService: PostService;

  constructor() {
    this.postService = new PostService();
  }

  getAll = async (req: Request, res: Response) => {
    const { limit, offset } = req.query;
    const posts = await this.postService.getAllPosts(
      parseInt(limit as string) || 10,
      parseInt(offset as string) || 0,
    );
    res.json(posts);
  };

  getById = async (req: Request, res: Response) => {
    const post = await this.postService.getPostById(parseInt(req.params.id));
    post ? res.json(post) : res.status(404).json({ message: "Post not found" });
  };

  create = async (req: Request, res: Response) => {
    const { title, content, subreddit_id, media_type } = req.body;
    const file = req.file;
    const author_id = req.user?.userId;
    
    let fileUrl = "";
    if (file) {
      const b64 = Buffer.from(file.buffer).toString("base64");
      const dataURI = `data:${file.mimetype};base64,${b64}`;

      const result = await cloudinary.uploader.upload(dataURI, {
        resource_type: media_type === "video" ? "video" : "auto",
        folder: "post-assets",
      });
      fileUrl = result.secure_url;
    }

    const media = [
      { media_type, media_url: fileUrl }
    ]
    const newPost = await this.postService.createPostWithMedia(
      { title, content, author_id, subreddit_id },
      media,
    );
    res.status(201).json(newPost);
  };

  update = async (req: Request, res: Response) => {
    const updatedPost = await this.postService.updatePost(
      parseInt(req.params.id),
      req.body,
    );
    res.json(updatedPost);
  };

  delete = async (req: Request, res: Response) => {
    await this.postService.deletePost(parseInt(req.params.id));
    res.status(204).send();
  };

  save = async (req: Request, res: Response) => {
    const { post_id } = req.body;
    const user_id = req.user?.userId;
    const savedPost = await this.postService.createSavedPost({
      user_id,
      post_id,
    });
    res.status(201).json(savedPost);
  };

  deleteSaved = async (req: Request, res: Response) => {
    const { post_id } = req.body;
    const user_id = req.user?.userId;
    await this.postService.deleteSavedPost({ user_id, post_id });
    res.status(204).send();
  };

  getAllMySaved = async (req: Request, res: Response) => {
    const user_id = req.user?.userId;
    const savedPosts = await this.postService.getAllMySaved({ user_id });
    res.json(savedPosts);
  };

  getMySaved = async (req: Request, res: Response) => {
    const post_id = parseInt(req.query.post_id as string);
    const user_id = req.user?.userId;
    const savedPost = await this.postService.getMySaved({ user_id, post_id });
    res.json(savedPost);
  };
}
