export interface Vote {
  id: number;
  user_id: number | string;
  post_id: number;
  comment_id?: number;
  vote_type: 1 | -1;
  created_at: Date;
}
