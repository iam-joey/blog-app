import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import blog from "./routes/blog";
import user from "./routes/user";
import { cors } from "hono/cors";
import userUpdate from "./routes/useraupdate";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
  };
  Variables: {
    prisma: PrismaClient;
  };
}>();

app.use(cors());

app.use("*", async (c, next) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  //@ts-ignore
  //@ts-ignore

  c.set("prisma", prisma);
  await next();
});

app.route("/auth/v1/user", user);
app.route("/api/v1/blog", blog);
app.route("/api/v1/auth/user", userUpdate);

export default app;
