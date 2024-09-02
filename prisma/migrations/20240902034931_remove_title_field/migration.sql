/*
  Warnings:

  - You are about to drop the column `title` on the `Poll` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `PollOption` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Poll" DROP COLUMN "title";

-- AlterTable
ALTER TABLE "PollOption" DROP COLUMN "title";
