import express from "express";
import jwt from "jsonwebtoken";

import { auth } from "./middleware/auth";
import { JWT_SECRET } from "@repo/backend-common/config";
import { prismaClient } from "@repo/database/client";
import {
  CreateUserSchema,
  SigninSchema,
  CreateRoomSchema,
} from "@repo/com/types";

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
  try {
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
  } catch (e) {
    console.log(e);
  }
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

//get message
app.get("/chats/:roomId", async (req, res) => {
  const roomId = Number(req.params.roomId);
  try {
    const messages = await prismaClient.chat.findMany({
      where: {
        roomId: roomId,
      },
      orderBy: {
        id: "desc",
      },
      take: 50,
    });
    res.json({ messages });
  } catch (e) {
    console.log(e);
  }
});
