import express from "express";
import { PrismaClient } from "@prisma/client";

export const router = express.Router();
const prisma = new PrismaClient();

router.use(async (req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`, req.params);

  next();
});

router.get("/r/:id", async (req, res) => {
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
