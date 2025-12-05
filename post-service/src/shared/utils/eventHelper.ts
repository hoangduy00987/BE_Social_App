import { Comment } from "../../models/comment.model.js";

export const createCommentCreatedEvent = ({
  comment,
  author,
  ownerUserId,
}: {
  comment: Comment;
  author: any; // enriched user info
  ownerUserId: number;
}) => {
  return {
    eventId: `comment-${comment.id}-${Date.now()}`,
    eventType: "post.comment-created.v1",
    occurredAt: new Date().toISOString(),

    actor: {
      userId: String(comment.author_id),
      username: author?.full_name ?? "Unknown User",
    },

    target: {
      postId: comment.post_id,
      commentId: comment.id,
      ownerUserId: String(ownerUserId),
    },

    context: {
      snippet: comment.content.slice(0, 120),
    },
  };
}
