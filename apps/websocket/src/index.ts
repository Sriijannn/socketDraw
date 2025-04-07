import { WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";

import { JWT_SECRET } from "@repo/backend-common/config";

const wss = new WebSocketServer({ port: 8080 });

function checkUser(token: string): string | null {
  const decoded = jwt.verify(token, JWT_SECRET);
  if (typeof decoded == "string") {
    return null;
  }
  if (!decoded || !decoded.userId) {
    return null;
  }
  return decoded.userId;
}

wss.on("connection", function connection(ws, request) {
  const url = request.url;
  if (!url) {
    return;
  }
  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token") || "";
  // there is a code duplication required where .env file will be present in both the backend servers which must be optimized
  const userId = checkUser(token);
  if (!userId) {
    ws.close();
  }
  //possible update here is maybe we can stop the user in the http layer itself before the connnection upgrades to ws.

  ws.on("message", function message(data) {
    ws.send("pong");
  });
});
