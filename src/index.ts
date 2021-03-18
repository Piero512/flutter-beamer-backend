import { MemoryBackend } from "./model/memory_backend";
import express from 'express';
import { router } from "./router/router";
const app = express();
app.get('/', (req,res) => {
    res.send('Hola mundo!');
})
app.use('/router', router);
app.listen(3000, () => {
    console.log("Iniciada app de express");
})
const passkeyBackend = new MemoryBackend();

