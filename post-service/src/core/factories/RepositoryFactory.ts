import { CommentRepository } from "../../repositories/comment.repository.js";
import { PostMediaRepository } from "../../repositories/post-media.repository.js";
import { PostRepository } from "../../repositories/post.repository.js";
import { SavedPostRepository } from "../../repositories/saved-post.repository.js";
import { VoteRepository } from "../../repositories/vote.repository.js";

export class RepositoryFactory {
  createRepository(entity: string) {
    switch (entity) {
      case "Post":
        return new PostRepository();
      case "PostMedia":
        return new PostMediaRepository();
      case "Vote":
        return new VoteRepository();
      case "Comment":
        return new CommentRepository();
      case "SavedPost":
        return new SavedPostRepository();
      default:
        throw new Error("Repository not found");
    }
  }
}
