-- CreateTable
CREATE TABLE "Subreddit" (
    "subreddit_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_by" INTEGER NOT NULL,
    "subcategory_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Subreddit_pkey" PRIMARY KEY ("subreddit_id")
);

-- CreateTable
CREATE TABLE "SubredditRule" (
    "rule_id" SERIAL NOT NULL,
    "rule_text" TEXT NOT NULL,
    "subreddit_id" INTEGER NOT NULL,

    CONSTRAINT "SubredditRule_pkey" PRIMARY KEY ("rule_id")
);

-- CreateTable
CREATE TABLE "SubredditCategory" (
    "subreddit_category_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "SubredditCategory_pkey" PRIMARY KEY ("subreddit_category_id")
);

-- CreateTable
CREATE TABLE "SubredditSubcategory" (
    "subreddit_subcategory_id" SERIAL NOT NULL,
    "subreddit_category_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "SubredditSubcategory_pkey" PRIMARY KEY ("subreddit_subcategory_id")
);

-- CreateTable
CREATE TABLE "SubredditBan" (
    "ban_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "subreddit_id" INTEGER NOT NULL,
    "banned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reason" TEXT,

    CONSTRAINT "SubredditBan_pkey" PRIMARY KEY ("ban_id")
);

-- CreateTable
CREATE TABLE "SubredditFlair" (
    "flair_id" SERIAL NOT NULL,
    "subreddit_id" INTEGER NOT NULL,
    "flair_name" TEXT NOT NULL,

    CONSTRAINT "SubredditFlair_pkey" PRIMARY KEY ("flair_id")
);

-- CreateTable
CREATE TABLE "Moderator" (
    "mod_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "subreddit_id" INTEGER NOT NULL,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Moderator_pkey" PRIMARY KEY ("mod_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subreddit_name_key" ON "Subreddit"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SubredditCategory_name_key" ON "SubredditCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SubredditSubcategory_name_key" ON "SubredditSubcategory"("name");

-- AddForeignKey
ALTER TABLE "Subreddit" ADD CONSTRAINT "Subreddit_subcategory_id_fkey" FOREIGN KEY ("subcategory_id") REFERENCES "SubredditSubcategory"("subreddit_subcategory_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubredditRule" ADD CONSTRAINT "SubredditRule_subreddit_id_fkey" FOREIGN KEY ("subreddit_id") REFERENCES "Subreddit"("subreddit_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubredditSubcategory" ADD CONSTRAINT "SubredditSubcategory_subreddit_category_id_fkey" FOREIGN KEY ("subreddit_category_id") REFERENCES "SubredditCategory"("subreddit_category_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubredditBan" ADD CONSTRAINT "SubredditBan_subreddit_id_fkey" FOREIGN KEY ("subreddit_id") REFERENCES "Subreddit"("subreddit_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubredditFlair" ADD CONSTRAINT "SubredditFlair_subreddit_id_fkey" FOREIGN KEY ("subreddit_id") REFERENCES "Subreddit"("subreddit_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Moderator" ADD CONSTRAINT "Moderator_subreddit_id_fkey" FOREIGN KEY ("subreddit_id") REFERENCES "Subreddit"("subreddit_id") ON DELETE CASCADE ON UPDATE CASCADE;
