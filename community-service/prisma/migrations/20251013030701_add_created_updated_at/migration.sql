/*
  Warnings:

  - You are about to drop the column `assigned_at` on the `Moderator` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `Moderator` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Subreddit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `SubredditBan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `SubredditCategory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `SubredditFlair` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `SubredditRule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `SubredditSubcategory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Moderator" DROP COLUMN "assigned_at",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Subreddit" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "SubredditBan" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "SubredditCategory" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "SubredditFlair" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "SubredditRule" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "SubredditSubcategory" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;
