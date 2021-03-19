import {MemoryBackend} from "./model/memory_backend";
import express from 'express';
import {createServer} from "http";
import Websocket from 'ws';
import cors from 'cors';
import {default as passKeyRouteBuilder} from "./routes/passkey";

const passkeyBackend = new MemoryBackend();
const port = process.env['PORT'] || 3000;
const app = express();
app.use(express.json());
app.use(cors())
app.use('/api', passKeyRouteBuilder(passkeyBackend))
const httpServer = createServer(app);
const wss = new Websocket.Server({
    server: httpServer,
    perMessageDeflate: false
});
wss.on('connection', function incoming(client) {
    client.send('Connected');
    client.close();
})
httpServer.listen(port);
httpServer.on('listening', ()=>  {
    console.log("Listening on port ", port);
})


