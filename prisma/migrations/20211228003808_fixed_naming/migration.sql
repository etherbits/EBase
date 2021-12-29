/*
  Warnings:

  - You are about to drop the column `content_id` on the `Content` table. All the data in the column will be lost.
  - Added the required column `contentId` to the `Content` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Content" DROP COLUMN "content_id",
ADD COLUMN     "contentId" INTEGER NOT NULL;
