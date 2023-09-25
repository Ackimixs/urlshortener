import { PrismaClient } from "@prisma/client";

export default async (req: any, res: any, prisma: PrismaClient) => {
  const long_url = req.query?.long_url || undefined;
  const code = req.query?.code || undefined;

  const urlData = await prisma.url.findMany({
    where: {
      long_url: long_url,
      code: code,
    },
  });

  res.send({
    body: {
      url: urlData,
    },
  });
};
