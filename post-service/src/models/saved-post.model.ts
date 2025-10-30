export interface SavedPost {
  id: number;
  user_id: number | string;
  post_id: number;
  saved_at: Date;
}
