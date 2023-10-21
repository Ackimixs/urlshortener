import server from "bunrest";
import { PrismaClient } from "@prisma/client";

const app = server();
const prisma = new PrismaClient();

app.get("/favicon.ico", (req, res) => {
    console.log("GET /favicon.ico");

    res.send(Bun.file("./public/favicon.ico"));
})

app.get("/api/url", async (req, res) => {
  console.log("GET /api/url");

  const url = await prisma.url.findMany();

  res.json({ body: { url } });
});

app.post("/api/url", async (req, res) => {
  console.log("POST /api/url");

  const { code, long_url } = req.body as { code: string; long_url: string };

  if (!isUrl(long_url)) return res.json({ body: { error: "Invalid URL" } });

  const url = await prisma.url.create({
    data: {
      code,
      long_url,
    },
  });

  res.json({ body: { url } });
});

app.get("/", (req, res) => {
  console.log("GET /");

  res.send(Bun.file("./public/index.html"));
});

app.get("/r/:id", async (req, res) => {
  console.log("GET /r/:id");

  const { id } = req.params as { id: string };

  const url = await prisma.url.findUnique({
    where: {
      code: id,
    },
  });

  if (url) {
    res
      .headers({
        Location: url.long_url,
      })
      .status(301)
      .send("Redirecting...");
  } else {
    res
      .headers({
        Location: "/",
      })
      .status(404)
      .send("Not found");
  }
});

app.delete("/api/url/:id", async (req, res) => {
  console.log("DELETE /api/url/:id");

  const { id } = req.params as { id: string };

  const url = await prisma.url.delete({
    where: {
      id,
    },
  });

  res.json({ body: { url } });
});

app.put("/api/url/:id", async (req, res) => {
  console.log("PUT /api/url/:id");

  const { id } = req.params as { id: string };
  const { code, long_url } = req.body as { code: string; long_url: string };

  if (!isUrl(long_url)) return res.json({ body: { error: "Invalid URL" } });

  const url = await prisma.url.update({
    where: {
      id,
    },
    data: {
      code,
      long_url,
    },
  });

  res.json({ body: { url } });
});

app.patch("/api/url/:id", async (req, res) => {
  console.log("PATCH /api/url/:id");

  const { id } = req.params as { id: string };
  const { code, long_url } = req.body as { code: string; long_url: string };

  if (!isUrl(long_url)) return res.json({ body: { error: "Invalid URL" } });

  const url = await prisma.url.update({
    where: {
      id,
    },
    data: {
      code,
      long_url,
    },
  });

  res.json({ body: { url } });
});

app.get("/api/url/:id", async (req, res) => {
  console.log("GET /api/url/:id");

  const { id } = req.params as { id: string };

  const url = await prisma.url.findUnique({
    where: {
      id,
    },
  });

  res.json({ body: { url } });
});

app.listen(process.env.PORT as string | 3000, () => {
  console.log(
    "Server listening on port " + (process.env.PORT as string | 3000)
  );
  prisma.$connect();
});

const isUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (err) {
    return false;
  }
};
