import type { Account } from "@prisma/client";
import type { ResponseData } from "../utils/Type";

export default defineEventHandler(
  async (event): Promise<ResponseData<Account | null>> => {
    const body = await readBody(event);
    const query = getQuery(event);
    const runtimeConfig = useRuntimeConfig();

    if (query.API_ROUTE_SECRET !== runtimeConfig.API_ROUTE_SECRET) {
      throw createError({
        statusCode: 401,
        statusMessage: "You are not authorized to call this API.",
      });
    }

    const data = await event.context.prisma.account.findFirst({
      where: {
        user: {
          email: body.email,
        },
      },
    });

    return {
      statusCode: 200,
      body: {
        data: data ?? null,
      },
      request: requestData(event),
    };
  }
);
