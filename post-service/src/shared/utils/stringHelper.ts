import slug from "slug";

export function createUniqueSlug(text: string): string {
  const basicSlug = slug(text, { lower: true });
  const unique =
    Date.now().toString(36) +
    "-" +
    Math.random().toString(36).substring(2, 6);

  return `${basicSlug}-${unique}`;
}
