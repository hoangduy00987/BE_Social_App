export interface Comment {
  id: number;
  post_id: number;
  author_id: number;
  content: string;
  parent_comment_id: number;
  is_deleted: boolean;
  vote_count: number;
  created_at: Date;
  updated_at: Date;
}
