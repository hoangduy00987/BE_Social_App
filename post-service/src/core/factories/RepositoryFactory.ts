import { CommentRepository } from "../../repositories/comment.repository";
import { PostMediaRepository } from "../../repositories/post-media.repository";
import { PostRepository } from "../../repositories/post.repository";
import { SavedPostRepository } from "../../repositories/saved-post.repository";
import { VoteRepository } from "../../repositories/vote.repository";

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
