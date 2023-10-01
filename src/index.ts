import express from "express";
import { PrismaClient } from "@prisma/client";
import * as url from "url";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

const app = express();
app.use(express.json());
const prisma = new PrismaClient();

app.get("/api/url", async (req, res) => {
  console.log("GET /api/url", req.query);
  const long_url = req.query?.long_url || undefined;
  const code = req.query?.code || undefined;

  const urlData = await prisma.url.findMany({
    where: {
      long_url: long_url as string,
      code: code as string,
    },
  });

  res.send({
    body: {
      url: urlData,
    },
  });
});

app.post("/api/url", async (req, res) => {
  console.log("POST /api/url", req.body);
  const { long_url } = req.body as { long_url: string };

  const code = req.body?.code || undefined;

  const urlObj = await prisma.url.create({
    data: {
      long_url: long_url,
      code: code,
    },
  });

  res.send({
    body: {
      url: urlObj,
    },
  });
});

app.get("/api/url/:id", async (req, res) => {
  console.log("GET /api/url/:id", req.params);
  const url = await prisma.url.findFirst({
    where: {
      id: req.params.id as string,
    },
  });

  res.send({
    body: {
      url: url,
    },
  });
});

app.put("/api/url/:id", async (req, res) => {
  console.log("PUT /api/url/:id", req.params);
  const url = await prisma.url.update({
    where: {
      id: req.params.id as string,
    },
    data: {
      long_url: req.body.long_url,
      code: req.body.code,
    },
  });

  res.send({
    body: {
      url: url,
    },
  });
});

app.patch("/api/url/:id", async (req, res) => {
  console.log("PATCH /api/url/:id", req.params);
  const url = await prisma.url.update({
    where: {
      id: req.params.id as string,
    },
    data: {
      long_url: req.body.long_url,
      code: req.body.code,
    },
  });

  res.send({
    body: {
      url: url,
    },
  });
});

app.delete("/api/url/:id", async (req, res) => {
  console.log("DELETE /api/url/:id", req.params);
  const url = await prisma.url.delete({
    where: {
      id: req.params.id as string,
    },
  });

  res.send({
    body: {
      url: url,
    },
  });
});

app.get("/", (req, res) => {
  console.log("GET /");
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/r/:id", async (req, res) => {
  console.log("GET /r/:id", req.params);
  const url = await prisma.url.findFirst({
    where: {
      code: req.params.id as string,
    },
  });

  if (url) {
    res.redirect(url.long_url);
  } else {
    res.send("404");
  }
});

app.listen(3000, () => {
  console.log("App started on port 3000");
});
