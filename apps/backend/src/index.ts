import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";
import { auth } from "./middleware/auth";
import { JWT_SECRET } from "@repo/backend-common/config";
import {
  CreateUserSchema,
  SigninSchema,
  CreateRoomSchema,
} from "@repo/com/types";
import { json } from "stream/consumers";
const app = express();
//port of backend server
app.listen(3002);
// there's some issue due to turborepo so for that I had to configure env manually.
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
//routes for the server

//signup
app.post("/signup", (req, res) => {
  const data = CreateUserSchema.safeParse(req.body);
  if (!data) {
    res.json({
      message: "incorrect inputs",
    });
    return;
  }

  res.json({
    userID: "1",
  });
});
//signin
app.post("/signin", (req, res) => {
  const data = SigninSchema.safeParse(req.body);
  if (!data) {
    res.json({
      message: "incorrect inputs",
    });
    return;
  }

  const userID = 1;
  const token = jwt.sign(
    {
      userID,
    },
    JWT_SECRET as string
  );
});
//room
app.post("/room", auth, (req, res) => {
  const data = CreateRoomSchema.safeParse(req.body);
  if (!data) {
    res.json({
      message: "incorrect inputs",
    });
    return;
  }
  //db call
  res.json({
    roomID: "1234",
  });
});
