import { Request, NextFunction, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

export function auth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers["authorization"] ?? "";
  // by default ts doesn't understand the payload so had to create a global.d.ts file and modified tsconfig
  const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
  if (decoded) {
    req.userId = decoded.userId;
    //updated the structure of the request object here.
    next();
  } else {
    res.status(403).json({ message: "Unauthorized" });
  }
}
