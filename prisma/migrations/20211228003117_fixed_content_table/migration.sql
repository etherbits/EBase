/*
  Warnings:

  - Added the required column `content_id` to the `Content` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
CREATE SEQUENCE "content_id_seq";
ALTER TABLE "Content" ADD COLUMN     "content_id" INTEGER NOT NULL,
ALTER COLUMN "id" SET DEFAULT nextval('content_id_seq');
ALTER SEQUENCE "content_id_seq" OWNED BY "Content"."id";
