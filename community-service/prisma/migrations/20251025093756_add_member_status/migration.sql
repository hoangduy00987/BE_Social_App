/*
  Warnings:

  - A unique constraint covering the columns `[community_id,user_id]` on the table `CommunityMember` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "MemberStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "CommunityMember" ADD COLUMN     "status" "MemberStatus" NOT NULL DEFAULT 'APPROVED';

-- CreateIndex
CREATE UNIQUE INDEX "CommunityMember_community_id_user_id_key" ON "CommunityMember"("community_id", "user_id");
