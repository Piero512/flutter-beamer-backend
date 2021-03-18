import {Router} from 'express';

export const router = Router();
router.use(
    (req,res,next) => {
        console.log("Received request at ", Date.now());
        next();
    }
);

router.get('/', (req,res)=> {
    res.send("Index page for router");
})