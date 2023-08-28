/*
  Warnings:

  - A unique constraint covering the columns `[path]` on the table `Url` will be added. If there are existing duplicate values, this will fail.
  - The required column `path` was added to the `Url` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "Url" ADD COLUMN     "path" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Url_path_key" ON "Url"("path");
