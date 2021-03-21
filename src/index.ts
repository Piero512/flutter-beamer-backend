import { MemoryBackend } from "./model/memory_backend";
import express from "express";
import { createServer } from "http";
import Websocket from "ws";
import cors from "cors";
import { default as passKeyRouteBuilder } from "./routes/passkey";
import { MessageModel } from "./model/msg_model";

const passkeyBackend = new MemoryBackend();
const port = process.env["PORT"] || 3000;
const app = express();
app.use(express.json());
app.use(cors());
app.use("/api", passKeyRouteBuilder(passkeyBackend));
const httpServer = createServer(app);
const wss = new Websocket.Server({
  server: httpServer,
  perMessageDeflate: false,
});
wss.on("connection", function incoming(client) {
  client.on("message", (data) => {
    const msg = JSON.parse(data.toString());
    try {
      const parsed = msg as MessageModel;
      if (parsed.action.toLowerCase() == "subscribe") {
        passkeyBackend.subscribePosition(parsed.passkey, (newLocation) =>
          client.send(JSON.stringify(newLocation))
        );
      } else {
        client.send(
          JSON.stringify({ error: `action not supported: ${parsed.action}` })
        );
      }
    } catch (e) {
      client.send(JSON.stringify({ error: e.toString() }));
    }
  });
});
httpServer.listen(port);
httpServer.on("listening", () => {
  console.log("Listening on port ", port);
});
