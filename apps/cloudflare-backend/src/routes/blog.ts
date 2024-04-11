import { PrismaClient } from "@prisma/client/edge";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { verify } from "hono/jwt";
import { z } from "zod";
interface User {
  id: string;
  email: string;
}

const blog = new Hono<{
  Bindings: {
    DATABASE_URL: string;
  };
  Variables: {
    user: User;
    prisma: PrismaClient;
  };
}>();

blog.use("*", async (c, next) => {
  const token = c.req.header("Authorization");
  if (!token) {
    c.status(403);
    return c.json({
      msg: "Not authorized",
    });
  }
  const user: User = await verify(token, "EnvFIleNotWorking");
  c.set("user", user);
  console.log("inisde middleawre");
  await next();
});

blog.get("/published", async (c) => {
  try {
    const prisma = c.get("prisma");
    const published = await prisma.post.findMany({
      where: {
        published: true,
      },
    });

    c.status(201);
    return c.json({
      msg: "successfully fetched",
      published,
    });
  } catch (error) {
    c.status(403);
    return c.json({
      msg: "something went wrong",
    });
  }
});

blog.post(
  "/create",
  zValidator(
    "json",
    z.object({
      title: z.string(),
      content: z.string(),
    })
  ),
  async (c) => {
    try {
      console.log("inisde log");
      const { title, content } = await c.req.valid("json");
      const prisma = c.get("prisma");
      console.log("inisde");
      const user = c.get("user");

      const post = await prisma.post.create({
        data: {
          title: title,
          content: content,
          authorId: user.id,
        },
      });

      c.status(201);
      return c.json({
        msg: "created",
        post,
      });
    } catch (error) {
      c.status(403);
      return c.json({ err: "something went wrong" });
    }
  }
);

blog.get("/:blogID", async (c) => {
  try {
    const prisma = c.get("prisma");
    const blogId = c.req.param("blogID");
    const post = await prisma.post.findUnique({
      where: {
        id: blogId,
      },
    });

    return c.json({
      post,
    });
  } catch (error) {
    c.status(403);
    return c.json({ err: "something went wrong" });
  }
});

blog.get("/userPosts", async (c) => {
  try {
  } catch (error) {
    c.status(403);
    return c.json({
      msg: "something went wrong",
    });
  }
});

export default blog;
