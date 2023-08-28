-- CreateTable
CREATE TABLE "Traffic" (
    "id" TEXT NOT NULL,
    "urlId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Traffic_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Traffic" ADD CONSTRAINT "Traffic_urlId_fkey" FOREIGN KEY ("urlId") REFERENCES "url"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
