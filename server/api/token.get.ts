import { getToken } from "#auth";
import type { JWT } from "next-auth/jwt";
import type { ResponseData } from "../utils/Type";

export default defineEventHandler(
  async (event): Promise<ResponseData<JWT | null>> => {
    const token = await getToken({ event });

    return {
      statusCode: 200,
      body: {
        data: token,
      },
      request: requestData(event),
    };
  }
);
