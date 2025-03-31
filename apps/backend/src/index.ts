import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";
import { auth } from "./middleware/auth";
import { JWT_SECRET } from "@repo/backend-common/config";
import { prismaClient } from "@repo/database/client";
import {
  CreateUserSchema,
  SigninSchema,
  CreateRoomSchema,
} from "@repo/com/types";
import { json } from "stream/consumers";
const app = express();
//port of backend server
app.listen(3002);
app.use(express.json());

//signup
app.post("/signup", async (req, res) => {
  const parsedData = CreateUserSchema.safeParse(req.body);
  if (!parsedData) {
    res.json({
      message: "incorrect inputs",
    });
    return;
  }
  try {
    const user = await prismaClient.user.create({
      data: {
        email: parsedData.data?.username as string,
        name: parsedData.data?.name as string,
        //hash the password later
        password: parsedData.data?.password as string,
      },
    });

    res.json({
      userID: user.id,
    });
  } catch (e) {
    res.status(411).json({
      message: "User already exists",
    });
  }
});
//signin
app.post("/signin", async (req, res) => {
  const parsedData = SigninSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({
      message: "Incorrect Inputs",
    });
    return;
  }
  const user = await prismaClient.user.findFirst({
    where: {
      email: parsedData.data.username,
      password: parsedData.data.password,
    },
  });
  if (!user) {
    res.status(403).json({
      message: "User doesn't exist",
    });
  }

  const token = jwt.sign(
    {
      userId: user?.id,
    },
    JWT_SECRET
  );
  res.status(200).json({
    token,
  });
});
//room
app.post("/room", auth, async (req, res) => {
  const parsedData = CreateRoomSchema.safeParse(req.body);
  if (!parsedData) {
    res.json({
      message: "incorrect inputs",
    });
    return;
  }
  // @ts-ignore:
  const userId = req.userId;
  try {
    const newroom = await prismaClient.room.create({
      data: {
        slug: parsedData.data?.name as string,
        adminId: userId,
      },
    });

    if (newroom) {
      res.status(200).json({
        message: "Room Created",
        roomid: newroom.id,
      });
    }
  } catch (e) {
    res.status(403).json({
      message: "Room Already Exists",
    });
  }
});
