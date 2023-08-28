-- DropForeignKey
ALTER TABLE "Traffic" DROP CONSTRAINT "Traffic_urlId_fkey";

-- DropForeignKey
ALTER TABLE "url" DROP CONSTRAINT "url_userId_fkey";

-- AddForeignKey
ALTER TABLE "url" ADD CONSTRAINT "url_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Traffic" ADD CONSTRAINT "Traffic_urlId_fkey" FOREIGN KEY ("urlId") REFERENCES "url"("id") ON DELETE CASCADE ON UPDATE CASCADE;
