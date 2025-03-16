import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";
import { auth } from "./middleware/auth";
const app = express();
//port of backend server
app.listen(3002);
// there's some issue due to turborepo so for that I had to configure env manually.
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
//routes for the server

//signup
app.post("/signup", (req, res) => {
  res.json({
    userID: "1",
  });
});
//signin
app.post("/signin", (req, res) => {
  const userID = 1;
  const token = jwt.sign(
    {
      userID,
    },
    process.env.JWT_SECRET as string
  );
});
//room
app.post("/room", auth, (req, res) => {
  //db call
  res.json({
    roomID: "1234",
  });
});
