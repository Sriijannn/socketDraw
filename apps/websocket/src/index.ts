import { WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JsonWebTokenError } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", function connection(ws, request) {
  const url = request.url;
  if (!url) {
    return;
  }
  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token") || "";
  // there is a code duplication required where .env file will be present in both the backend servers which must be optimized
  const decoded = jwt.verify(token, JWT_SECRET);
  //possible update here is maybe we can stop the user in the http layer itself before the connnection upgrades to ws.
  if (!decoded || !(decoded as JwtPayload).userID) {
    ws.close();
    return;
  }
  ws.on("message", function message(data) {
    ws.send("pong");
  });
});
