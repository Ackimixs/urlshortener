import { getServerSession } from "#auth";
import type { ResponseData } from "../utils/Type";
import type { Url } from "@prisma/client";

export default defineEventHandler(async (event): Promise<ResponseData<Url>> => {
  const { path, origin_url, id } = getQuery(event) as { [key: string]: string };

  const session = await getServerSession(event);

  if (!session) {
    return {
      statusCode: 401,
      body: {
        err: {
          error: "Unauthorized",
          message: "You must be logged in to do this.",
        },
      },
      request: requestData(event),
    };
  }

  const newUrl = await event.context.prisma.url.update({
    where: {
      id,
      createBy: {
        email: session.user?.email,
      },
    },
    data: {
      path,
      OriginUrl: origin_url,
    },
  });

  return {
    statusCode: 200,
    body: {
      data: newUrl,
    },
    request: requestData(event),
  };
});
