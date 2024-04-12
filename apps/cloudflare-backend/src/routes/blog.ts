import { PrismaClient } from "@prisma/client/edge";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

import { Hono } from "hono";
import { verify } from "hono/jwt";
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
    const user = c.get("user");
    const prisma = c.get("prisma");
    const userPosts = await prisma.post.findMany({
      where: {
        authorId: user.id,
      },
    });

    c.status(201);
    return c.json({
      msg: "successfully fetched",
      data: userPosts,
    });
  } catch (error) {
    c.status(403);
    return c.json({
      msg: "something went wrong",
    });
  }
});

blog.put(
  "/:blogID",
  zValidator(
    "json",
    z.object({
      title: z.string().optional(),
      content: z.string().optional(),
      published: z.boolean().optional(),
    })
  ),
  async (c) => {
    try {
      const prisma = c.get("prisma");
      const blogId = c.req.param("blogID");
      const body = c.req.valid("json");
      const post = await prisma.post.update({
        where: {
          id: blogId,
        },
        data: {
          title: body.title,
          content: body.content,
          published: body.published,
        },
      });

      return c.json({
        post,
      });
    } catch (error) {
      c.status(403);
      return c.json({ err: "something went wrong" });
    }
  }
);

export default blog;
