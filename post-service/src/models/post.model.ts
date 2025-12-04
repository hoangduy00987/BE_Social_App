export interface Post {
  id: number;
  author_id: number;
  subreddit_id?: number;
  title: string;
  content: string;
  slug: string;
  nr_of_comments: number;
  is_deleted: boolean;
  vote_count: number;
  created_at: Date;
  updated_at: Date;
}
