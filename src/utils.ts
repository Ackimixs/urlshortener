import express from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const checkToken = async (
  req: express.Request,
  res: express.Response
): Promise<Boolean> => {
  const token = req.headers["x-token"] as string;

  if (!token) {
    res.send({
      body: {
        error: "Missing Token",
      },
    });
    return false;
  }

  const tokenDb = await prisma.token.findFirst({
    where: {
      token: token,
    },
  });

  if (!tokenDb) {
    res.send({
      body: {
        error: "Invalid token",
      },
    });
    return false;
  }

  if (tokenDb.expiresAt < new Date()) {
    res.send({
      body: {
        error: "Token expired",
      },
    });
    return false;
  }

  if (!tokenDb.available) {
    res.send({
      body: {
        error: "Token not available",
      },
    });
    return false;
  }

  return true;
};
