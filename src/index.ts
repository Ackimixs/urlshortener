import express from "express";
import { PrismaClient } from "@prisma/client";
import { router as ApiUrlRouter } from "./routes/apiUrl.js";
import { router as ApiAuthRouter } from "./routes/auth.js";
import { router as HomeRouter } from "./routes/redirect.js";
import * as url from "url";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

const app = express();
app.use(express.json());
const prisma = new PrismaClient();

app.use("/api/url", ApiUrlRouter);
app.use("/api", ApiAuthRouter);
app.use("/", HomeRouter);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.listen(process.env.PORT || 8000, () => {
  console.log("App started on port " + process.env.PORT || 8000);
});
