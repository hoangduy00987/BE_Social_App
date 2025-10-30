/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable("posts", {
    id: { type: "serial", primaryKey: true },
    author_id: { type: "integer", notNull: true },
    subreddit_id: { type: "integer" },
    title: { type: "varchar(255)", notNull: true },
    content: { type: "text", notNull: true },
    slug: { type: "varchar(255)", notNull: true, unique: true },
    is_deleted: { type: "boolean", default: false },
    vote_count: { type: "integer", default: 0 },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
    updated_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
  });

  pgm.createTable("votes", {
    id: { type: "serial", primaryKey: true },
    user_id: { type: "integer", notNull: true },
    post_id: { type: "integer", notNull: true },
    comment_id: { type: "integer" },
    vote_type: { type: "smallint", notNull: true }, // 1 for upvote, -1 for downvote
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
  });

  pgm.createTable("post_media", {
    id: { type: "serial", primaryKey: true },
    post_id: { type: "integer", notNull: true },
    media_url: { type: "text", notNull: true },
    media_type: { type: "varchar(50)", notNull: true }, // e.g., 'image', 'video'
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
  });

  pgm.createTable("comments", {
    id: { type: "serial", primaryKey: true },
    post_id: { type: "integer", notNull: true },
    author_id: { type: "integer", notNull: true },
    content: { type: "text", notNull: true },
    parent_comment_id: { type: "integer" }, // For nested comments
    is_deleted: { type: "boolean", default: false },
    vote_count: { type: "integer", default: 0 },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
    updated_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
  });

  pgm.createTable("comment_replies", {
    id: { type: "serial", primaryKey: true },
    comment_id: { type: "integer", notNull: true },
    reply_author_id: { type: "integer", notNull: true },
    reply_content: { type: "text", notNull: true },
    is_deleted: { type: "boolean", default: false },
    vote_count: { type: "integer", default: 0 },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
    updated_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
  });

  pgm.createTable("saved_posts", {
    id: { type: "serial", primaryKey: true },
    user_id: { type: "integer", notNull: true },
    post_id: { type: "integer", notNull: true },
    saved_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
  });

  pgm.createTable("post_tags", {
    id: { type: "serial", primaryKey: true },
    post_id: { type: "integer", notNull: true },
    name: { type: "varchar(50)", notNull: true },
    slug: { type: "varchar(50)", notNull: true },
  });

  pgm.addConstraint("votes", "unique_user_post_comment", {
    unique: ["user_id", "post_id", "comment_id"],
  });

  pgm.addConstraint("votes", "fk_post_votes", {
    foreignKeys: {
      columns: "post_id",
      references: "posts(id)",
      onDelete: "CASCADE",
    },
  });

  pgm.addConstraint("post_media", "fk_post_media", {
    foreignKeys: {
      columns: "post_id",
      references: "posts(id)",
      onDelete: "CASCADE",
    },
  });

  pgm.addConstraint("comments", "fk_post_comments", {
    foreignKeys: {
      columns: "post_id",
      references: "posts(id)",
      onDelete: "CASCADE",
    },
  });

  pgm.addConstraint("comment_replies", "fk_comment_replies", {
    foreignKeys: {
      columns: "comment_id",
      references: "comments(id)",
      onDelete: "CASCADE",
    },
  });

  pgm.addConstraint("saved_posts", "fk_saved_posts", {
    foreignKeys: {
      columns: "post_id",
      references: "posts(id)",
      onDelete: "CASCADE",
    },
  });

  pgm.addConstraint("post_tags", "fk_post_tags", {
    foreignKeys: {
      columns: "post_id",
      references: "posts(id)",
      onDelete: "CASCADE",
    },
  });

  pgm.addConstraint("saved_posts", "unique_user_saved_post", {
    unique: ["user_id", "post_id"],
  });

  pgm.addConstraint("post_tags", "unique_post_tag", {
    unique: ["post_id", "name"],
  });

  pgm.addIndex("posts", ["author_id", "created_at"]);
  pgm.addIndex("posts", "subreddit_id");
  pgm.addIndex("votes", ["user_id", "post_id", "comment_id"]);
  pgm.addIndex("post_media", "post_id");
  pgm.addIndex("comments", "post_id");
  pgm.addIndex("comments", "parent_comment_id");
  pgm.addIndex("comments", "author_id");
  pgm.addIndex("comment_replies", "comment_id");
  pgm.addIndex("saved_posts", ["user_id", "post_id"]);
  pgm.addIndex("post_tags", "post_id");
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropConstraint("votes", "unique_user_post_comment");
  pgm.dropConstraint("votes", "fk_post_votes");
  pgm.dropConstraint("post_media", "fk_post_media");
  pgm.dropConstraint("comments", "fk_post_comments");
  pgm.dropConstraint("comment_replies", "fk_comment_replies");
  pgm.dropConstraint("saved_posts", "fk_saved_posts");
  pgm.dropConstraint("post_tags", "fk_post_tags");
  pgm.dropConstraint("saved_posts", "unique_user_saved_post");
  pgm.dropConstraint("post_tags", "unique_post_tag");

  pgm.dropIndex("posts", ["author_id", "created_at"]);
  pgm.dropIndex("posts", "subreddit_id");
  pgm.dropIndex("votes", ["user_id", "post_id", "comment_id"]);
  pgm.dropIndex("post_media", "post_id");
  pgm.dropIndex("comments", "post_id");
  pgm.dropIndex("comments", "parent_comment_id");
  pgm.dropIndex("comments", "author_id");
  pgm.dropIndex("comment_replies", "comment_id");
  pgm.dropIndex("saved_posts", ["user_id", "post_id"]);
  pgm.dropIndex("post_tags", "post_id");

  pgm.dropTable("posts");
  pgm.dropTable("votes");
  pgm.dropTable("post_media");
  pgm.dropTable("comments");
  pgm.dropTable("comment_replies");
  pgm.dropTable("saved_posts");
  pgm.dropTable("post_tags");
};
