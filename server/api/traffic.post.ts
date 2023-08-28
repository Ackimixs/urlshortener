import type { Traffic } from "@prisma/client";
import type { ResponseData } from "../utils/Type";

export default defineEventHandler(
  async (event): Promise<ResponseData<Traffic>> => {
    const { id } = (await readBody(event)) as { id: string };

    const url = await event.context.prisma.url.findUnique({
      where: {
        id,
      },
    });

    if (!url) {
      return {
        statusCode: 404,
        body: {
          err: {
            error: "Not Found",
            message: "There is no url with this id.",
          },
        },
        request: requestData(event),
      };
    }

    const traffic = await event.context.prisma.traffic.create({
      data: {
        url: {
          connect: {
            id: url?.id,
          },
        },
      },
    });

    return {
      statusCode: 200,
      body: {
        data: traffic,
      },
      request: requestData(event),
    };
  }
);
