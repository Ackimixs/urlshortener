import type { Url } from "@prisma/client";
import type { ResponseData } from "../utils/Type";

export default defineEventHandler(
  async (event): Promise<ResponseData<Url | null>> => {
    const { path } = getQuery(event) as { path: string };

    const url = await event.context.prisma.url.findUnique({
      where: {
        path,
      },
    });

    return {
      statusCode: 200,
      body: {
        data: url,
      },
      request: requestData(event),
    };
  }
);
