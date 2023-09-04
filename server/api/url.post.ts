import { PrismaClient } from "@prisma/client";

export default async (req: any, res: any, prisma: PrismaClient) => {
  const { long_url } = req.body as { long_url: string };

  const code = req.body?.code || undefined;

  const urlObj = await prisma.url.create({
    data: {
      LongUrl: long_url,
      Code: code,
    },
  });

  res.send({
    body: {
      url: urlObj,
    },
  });
};
