import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

export const router = express.Router();
const prisma = new PrismaClient();

router.use(async (req, res, next) => {
  console.log(
    `${req.method} ${req.originalUrl}`,
    req.body,
    req.params,
    req.query
  );

  next();
});

router.post("/createapp", async (req, res) => {
  const { name } = req.query as { name: string };

  const { email, password } = req.body as { email: string; password: string };

  const user = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });

  if (!user) {
    res.send({
      body: {
        error: "Invalid credentials",
      },
    });
    return;
  }

  if (!(await bcrypt.compare(password, user.hash))) {
    res.send({
      body: {
        error: "Invalid credentials",
      },
    });
    return;
  }

  const app = await prisma.app.create({
    data: {
      name: name,
      user: {
        connect: {
          id: user?.id,
        },
      },
    },
  });

  res.send({
    body: {
      app: app,
    },
  });
});

router.post("/token", async (req, res) => {
  const { client_id } = req.query as { client_id: string };

  const { secret } = req.body as { secret: string };

  if (!client_id || !secret) {
    res.send({
      body: {
        error: "Missing Client ID or Client Secret",
      },
    });
    return;
  }

  const app = await prisma.app.findFirst({
    where: {
      clientId: client_id,
      secret: secret,
    },
  });

  const token = await prisma.token.create({
    data: {
      App: {
        connect: {
          id: app?.id,
        },
      },
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    },
  });

  await prisma.token.updateMany({
    where: {
      App: {
        clientId: client_id,
      },
      id: {
        not: token.id,
      },
      available: true,
    },
    data: {
      available: false,
    },
  });

  res.send({
    body: {
      token: token.token,
    },
  });
});

router.post("/user/signup", async (req, res) => {
  const body = req.body as { email: string; password: string };

  const hash = await bcrypt.hash(body.password, 10);

  const user = await prisma.user.create({
    data: {
      email: body.email,
      hash,
    },
    select: {
      email: true,
    },
  });

  res.send({
    body: {
      user: user,
    },
  });
});

router.post("/user/login", async (req, res) => {
  const body = req.body as { email: string; password: string };

  const user = await prisma.user.findFirst({
    where: {
      email: body.email,
    },
  });

  if (!user) {
    res.send({
      body: {
        error: "Invalid credentials",
      },
    });
    return;
  }

  if (!(await bcrypt.compare(body.password, user.hash))) {
    res.send({
      body: {
        error: "Invalid credentials",
      },
    });
    return;
  }

  const token = await prisma.token.create({
    data: {
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      User: {
        connect: {
          id: user.id,
        },
      },
    },
  });

  await prisma.token.updateMany({
    where: {
      User: {
        email: body.email,
      },
      id: {
        not: token.id,
      },
      available: true,
    },
    data: {
      available: false,
    },
  });

  res.send({
    body: {
      user: user,
      token: {
        token: token.token,
        expiresAt: token.expiresAt,
      },
    },
  });
});
