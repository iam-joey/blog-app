import { PrismaClient } from "@prisma/client/edge";
import { sign, verify } from "hono/jwt";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const userUpdate = new Hono<{
  Bindings: {
    DATABASE_URL: string;
  };
  Variables: {
    user: User;
    prisma: PrismaClient;
  };
}>();

interface User {
  id: string;
  email: string;
}

interface UpdateUserRequest {
  email?: string;
  name?: string;
}

userUpdate.use("*", async (c, next) => {
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

userUpdate.post(
  "/update",
  zValidator(
    "json",
    z.object({
      email: z.string().optional(),
      name: z.string().optional(),
    })
  ),
  async (c) => {
    try {
      console.log("here");
      const prisma = c.get("prisma");
      const body = await c.req.valid("json");
      const user = c.get("user");

      if (body.email) {
        const find = await prisma.user.findUnique({
          where: {
            email: body.email,
          },
        });
        if (find) {
          c.status(403);
          return c.json({
            msg: "Email already exists",
          });
        }
      }
      let update: UpdateUserRequest = {};

      if (body.email) {
        update.email = body.email;
      }

      if (body.name) {
        update.name = body.name;
      }
      console.log(update);
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: update,
      });
      c.status(201);
      return c.json({
        msg: "Updated successfully",
      });
    } catch (error) {
      c.status(403);
      return c.json({ error: "error while update" });
    }
  }
);

userUpdate.get("/me", async (c) => {
  try {
    const prisma = c.get("prisma");
    const user = c.get("user");
    const data = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });

    if (!data) {
      c.status(403);
      return c.json({ error: "No user present" });
    }

    c.status(201);
    return c.json({
      msg: "fetched details",
      data,
    });
  } catch (error) {
    c.status(403);
    return c.json({ error: "error while fetching" });
  }
});

export default userUpdate;
