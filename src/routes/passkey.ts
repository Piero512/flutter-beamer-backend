import {Router} from 'express';
import { PasskeyBackend } from '../model/passkey_backend';

let backEnd: PasskeyBackend | undefined = undefined;
const passkeyApi = Router();

passkeyApi.use(function checkBackend(req,res,next){
    if(backEnd === undefined){
        res.status(500);
        res.send("No backend registered!");
        res.end();
    } else {
        next();
    }
}
);

passkeyApi.post('/:id', (req, res) => {
    let passkeyId = req.params['id'];
    let lat = req.body['lat'];
    let long = req.body['long'];
    if(backEnd?.exists(passkeyId)){
        res.status(409).send({'error': 'Already exists'});
    } else {
        backEnd?.updatePosition(passkeyId, {lat,long});
        res.status(201).send('Created successfully');
    }
})

passkeyApi.get('/:id', (req,res) => {
    let passkeyId = req.params['id'];
    if(passkeyId && backEnd?.exists(passkeyId)){
        res.status(200).json(backEnd.getLastLocation(passkeyId))
    } else {
        res.status(404).json({'error': "No passkey with that number exists"});
    }
});

passkeyApi.post('/:id/update', (req,res) => {
    let passkeyId = req.params['id'];
    let lat = req.body['lat'];
    let long = req.body['long'];
    if(passkeyId && backEnd && lat && long){
        backEnd.updatePosition(passkeyId, {lat, long});
        res.status(201).send('Updated successfully');
    } else {
        res.status(400).send("The pass key doesn't exist");
    }
});

passkeyApi.delete('/:id', (req,res) => {
    let passkeyId = req.params['id'];
    if(passkeyId && backEnd?.exists(passkeyId)){
        backEnd.removeLocation(passkeyId);
        res.status(200).send("Deleted");
    } else {
        res.status(400).send("Pass key does not exist");
    }
});

export default function builder(back_end: PasskeyBackend) {
    backEnd = back_end;
    return passkeyApi;
};
