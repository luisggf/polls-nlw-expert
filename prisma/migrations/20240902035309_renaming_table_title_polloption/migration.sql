/*
  Warnings:

  - Added the required column `poll_title` to the `PollOption` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PollOption" ADD COLUMN     "poll_title" TEXT NOT NULL;
