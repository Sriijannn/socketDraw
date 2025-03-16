import { Request, NextFunction, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

export function auth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers["authorization"] ?? "";
  // by default ts doesn't understand the payload so had to create a global.d.ts file and modified tsconfig
  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET as string
  ) as JwtPayload;
  if (decoded) {
    req.userID = decoded.userID;
    next();
  } else {
    res.status(403).json({ message: "Unauthorized" });
  }
}
