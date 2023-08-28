/*
  Warnings:

  - You are about to drop the `url` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Traffic" DROP CONSTRAINT "Traffic_urlId_fkey";

-- DropForeignKey
ALTER TABLE "url" DROP CONSTRAINT "url_userId_fkey";

-- DropTable
DROP TABLE "url";

-- CreateTable
CREATE TABLE "Url" (
    "id" TEXT NOT NULL,
    "OriginUrl" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Url_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Url" ADD CONSTRAINT "Url_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Traffic" ADD CONSTRAINT "Traffic_urlId_fkey" FOREIGN KEY ("urlId") REFERENCES "Url"("id") ON DELETE CASCADE ON UPDATE CASCADE;
