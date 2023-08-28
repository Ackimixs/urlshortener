import { getServerSession } from "#auth";
import type { ResponseData } from "~/server/utils/Type";
import type { Url, Traffic, User } from "@prisma/client";

type ExtendedUrl = Url & { Traffic: Traffic[]; createBy: User };

export default defineEventHandler(
  async (event): Promise<ResponseData<ExtendedUrl | null>> => {
    const { path } = getQuery(event) as { path: string };

    const session = await getServerSession(event);

    const user = await event.context.prisma.user.findUnique({
      where: {
        email: session?.user?.email as string,
      },
    });

    if (!user) {
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

    const url = await event.context.prisma.url.findUnique({
      where: {
        userId: user.id,
        path,
      },
      include: {
        Traffic: true,
        createBy: true,
      },
    });

    return {
      statusCode: 200,
      body: {
        data: url ?? null,
      },
      request: requestData(event),
    };
  }
);
