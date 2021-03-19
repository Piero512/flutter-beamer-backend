import {Router} from 'express';

export const api = Router();
api.use(
    (req,res,next) => {
        console.log("Received request at ", Date.now());
        next();
    }
);

api.get('/', (req,res)=> {
    res.send("Index page for router");
})