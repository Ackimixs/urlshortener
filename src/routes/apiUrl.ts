import { checkToken } from "../utils.js";
import express from "express";
import { PrismaClient } from "@prisma/client";

export const router = express.Router();
const prisma = new PrismaClient();

router.use(async (req, res, next) => {
  console.log(
    `${req.method} ${req.originalUrl}`,
    req.body,
    req.params,
    req.query
  );

  if (!(await checkToken(req, res))) {
    return;
  }

  next();
});

router.get("/", async (req, res) => {
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

router.post("/", async (req, res) => {
  const { long_url } = req.body as { long_url: string };

  const code = req.body?.code || undefined;
  try {
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
    return;
  } catch (error) {
    res.send({
      body: {
        error: "Invalid URL or Code",
      },
    });
    return;
  }
});

router.get("/:id", async (req, res) => {
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

router.put("/:id", async (req, res) => {
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

router.patch("/:id", async (req, res) => {
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

router.delete("/:id", async (req, res) => {
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
