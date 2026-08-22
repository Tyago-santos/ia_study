/*
  Warnings:

  - Added the required column `answer` to the `schoolsubjects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `response` to the `schoolsubjects` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "schoolsubjects" ADD COLUMN     "answer" TEXT NOT NULL,
ADD COLUMN     "response" TEXT NOT NULL;
