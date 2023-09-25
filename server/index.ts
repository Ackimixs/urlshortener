import fs from "node:fs";
import path from "node:path";
import express from "express";
import { PrismaClient } from "@prisma/client";
const app = express();
app.use(express.json());
const prisma = new PrismaClient();

const getAllFiles = function (dirPath: string, arrayOfFiles: string[] = []) {
  let files = fs.readdirSync(import.meta.dir + dirPath);

  files.forEach(function (file) {
    if (
      fs.statSync(import.meta.dir + "/" + dirPath + "/" + file).isDirectory()
    ) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file));
    }
  });

  return arrayOfFiles;
};

let allApiRoute = getAllFiles("/api", []);

allApiRoute.forEach((api) => {
  const d = api.split(".");
  if (d[d.length - 1] !== "ts")
    return console.log("Invalid api file name: " + api);
  if (d.length !== 3) return console.log("Invalid api file name: " + api);

  let [route, method] = d;

  if (!["get", "post", "put", "delete"].includes(method)) {
    return console.log("Invalid api file name: " + api);
  }

  if (method === "get") {
    app.get(route, async (req, res) => {
      await require(import.meta.dir + api).default(req, res, prisma);
    });
  } else if (method === "post") {
    app.post(route, async (req, res) => {
      await require(import.meta.dir + api).default(req, res, prisma);
    });
  } else if (method === "put") {
    app.put(route, async (req, res) => {
      await require(import.meta.dir + api).default(req, res, prisma);
    });
  } else if (method === "delete") {
    app.delete(route, async (req, res) => {
      await require(import.meta.dir + api).default(req, res, prisma);
    });
  }
});

app.get("/", (req, res) => {
  res.sendFile(import.meta.dir + "/public/index.html");
});

app.get("*", async (req, res) => {
  const url = await prisma.url.findFirst({
    where: {
      code: req.url.replace("/", ""),
    },
  });

  if (url) {
    res.redirect(url.long_url);
  } else {
    res.send("404");
  }
});

app.listen(3000, () => {
  console.log('App started on port 3000')
});
