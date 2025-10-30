export interface CommentReply {
  id: number;
  comment_id: number;
  reply_author_id: number;
  reply_content: string;
  is_deleted: boolean;
  vote_count: number;
  created_at: Date;
  updated_at: Date;
}
