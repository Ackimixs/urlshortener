import { getServerSession } from "#auth";

export default defineEventHandler(async (event) => {
  const { id } = getQuery(event) as { id: string };

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

  await event.context.prisma.url.delete({
    where: {
      id,
      createBy: {
        email: session.user?.email,
      },
    },
  });

  return {
    statusCode: 200,
    body: {
      data: true,
    },
    request: requestData(event),
  };
});
