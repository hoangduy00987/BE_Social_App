export interface IPostRepository<T> {
  create(data: Partial<T>): Promise<T>;
  findBySlug(slug: string): Promise<T | null>;
  updateVoteCount(postId: number, delta: number): Promise<void>;
}
