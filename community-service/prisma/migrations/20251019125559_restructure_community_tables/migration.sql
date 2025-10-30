/*
  Warnings:

  - You are about to drop the `Moderator` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Subreddit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SubredditBan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SubredditCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SubredditFlair` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SubredditRule` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SubredditSubcategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Moderator" DROP CONSTRAINT "Moderator_subreddit_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Subreddit" DROP CONSTRAINT "Subreddit_subcategory_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."SubredditBan" DROP CONSTRAINT "SubredditBan_subreddit_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."SubredditFlair" DROP CONSTRAINT "SubredditFlair_subreddit_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."SubredditRule" DROP CONSTRAINT "SubredditRule_subreddit_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."SubredditSubcategory" DROP CONSTRAINT "SubredditSubcategory_subreddit_category_id_fkey";

-- DropTable
DROP TABLE "public"."Moderator";

-- DropTable
DROP TABLE "public"."Subreddit";

-- DropTable
DROP TABLE "public"."SubredditBan";

-- DropTable
DROP TABLE "public"."SubredditCategory";

-- DropTable
DROP TABLE "public"."SubredditFlair";

-- DropTable
DROP TABLE "public"."SubredditRule";

-- DropTable
DROP TABLE "public"."SubredditSubcategory";

-- CreateTable
CREATE TABLE "Community" (
    "community_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_by" INTEGER NOT NULL,
    "type_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Community_pkey" PRIMARY KEY ("community_id")
);

-- CreateTable
CREATE TABLE "CommunityType" (
    "type_id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "CommunityType_pkey" PRIMARY KEY ("type_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Community_name_key" ON "Community"("name");

-- AddForeignKey
ALTER TABLE "Community" ADD CONSTRAINT "Community_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "CommunityType"("type_id") ON DELETE RESTRICT ON UPDATE CASCADE;
