import { getServerSession } from "#auth";
import type { ResponseData } from "../utils/Type";
import type { Url } from "@prisma/client";

export default defineEventHandler(async (event): Promise<ResponseData<Url>> => {
  const session = await getServerSession(event);

  const { url, path } = (await readBody(event)) as {
    url: string;
    path: string | undefined;
  };

  if (!session?.user) {
    return {
      statusCode: 401,
      body: {
        err: {
          error: "Unauthorized",
          message: "Please login first.",
        },
      },
      request: requestData(event),
    };
  }

  // Check if an url exist and if yes, check if the user is the owner
  const u = await event.context.prisma.url.findFirst({
    where: {
      path,
    },
    include: {
      createBy: true,
    },
  });

  if (u && u.createBy.email !== session.user?.email) {
    return {
      statusCode: 401,
      body: {
        err: {
          error: "Unauthorized",
          message: "You are not the owner of this url.",
        },
      },
      request: requestData(event),
    };
  }

  if (path) {
    const shortUrl: Url = await event.context.prisma.url.upsert({
      where: {
        path,
      },
      update: {
        OriginUrl: url,
      },
      create: {
        path,
        OriginUrl: url,
        createBy: {
          connect: {
            email: session.user?.email as string,
          },
        },
      },
    });

    return {
      statusCode: 200,
      body: {
        data: shortUrl,
      },
      request: requestData(event),
    };
  } else {
    const shortUrl: Url = await event.context.prisma.url.create({
      data: {
        OriginUrl: url,
        createBy: {
          connect: {
            email: session.user?.email as string,
          },
        },
      },
    });

    return {
      statusCode: 201,
      body: {
        data: shortUrl,
      },
      request: requestData(event),
    };
  }
});
