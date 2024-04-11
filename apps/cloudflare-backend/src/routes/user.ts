import { PrismaClient } from "@prisma/client/edge";
import { sign } from "hono/jwt";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
const user = new Hono<{
  Bindings: {
    DATABASE_URL: string;
  };
  Variables: {
    prisma: PrismaClient;
  };
}>();

user.post(
  "/signup",
  zValidator(
    "json",
    z.object({
      email: z.string(),
      password: z.string(),
    })
  ),
  async (c) => {
    try {
      const prisma = c.get("prisma");
      const body = await c.req.valid("json");
      let password = Math.random().toString();
      const find = await prisma.user.findUnique({
        where: {
          email: body.email,
        },
      });
      if (find) {
        c.status(403);
        return c.json({
          msg: "User already exists",
        });
      }
      const user = await prisma.user.create({
        data: {
          email: body.email,
          password,
        },
      });
      c.status(201);
      return c.json({
        msg: "User created successfully",
      });
    } catch (error) {
      c.status(403);
      return c.json({ error: "error while signing up" });
    }
  }
);

user.post(
  "/signIn",
  zValidator(
    "json",
    z.object({
      email: z.string(),
    })
  ),
  async (c) => {
    try {
      const prisma = c.get("prisma");
      const body = await c.req.valid("json");
      const findUser = await prisma.user.findFirst({
        where: {
          email: body.email,
        },
      });

      if (!findUser) {
        c.status(403);
        return c.json({
          msg: "User with this email not present",
        });
      }
      let payload = {
        id: findUser.id,
        email: findUser.email,
      };
      const token = await sign(payload, "EnvFIleNotWorking");
      console.log(token);
      c.status(200);
      return c.json({
        msg: "logged in",
        token,
      });
    } catch (error) {
      c.status(403);
      return c.json({ error: "error while signing in" });
    }
  }
);

export default user;
