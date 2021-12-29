-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('MOVIE', 'TV');

-- CreateEnum
CREATE TYPE "ContentState" AS ENUM ('PLANNING', 'WATCHING', 'COMPLETED');

-- CreateTable
CREATE TABLE "Content" (
    "id" INTEGER NOT NULL,
    "type" "ContentType" NOT NULL,
    "state" "ContentState" NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Content_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
