/*
  Warnings:

  - Added the required column `image` to the `topics` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "topics" ADD COLUMN     "image" TEXT NOT NULL;
