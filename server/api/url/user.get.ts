import { getServerSession } from "#auth";
import type { Url } from "@prisma/client";
import type { ResponseData } from "~/server/utils/Type";

export default defineEventHandler(
  async (event): Promise<ResponseData<Url[]>> => {
    const session = await getServerSession(event);

    if (!session) {
      return {
        statusCode: 401,
        body: {
          err: {
            error: "Unauthorized",
            message: "You must be logged in to access this resource.",
          },
        },
        request: requestData(event),
      };
    }

    const urls = await event.context.prisma.url.findMany({
      where: {
        createBy: {
          email: session.user?.email,
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return {
      statusCode: 200,
      body: {
        data: urls,
      },
      request: requestData(event),
    };
  }
);
