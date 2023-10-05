import { Router } from "express";
import { userModel } from "../models/users.models.js";

const sessionRouter = Router();

sessionRouter.post('/login',async(req,res)=>{
    const {email,password} = req.body;
    try{
        if(req.session.login){
            res.status(200).send({result:'Login existente'});
        }else{
            const user = await userModel.findOne({email:email});
            if (user){
                if (user.password === password){
                    req.session.login = true;
                    res.status(200).send({result:'Login Ok',message:user});
                }else{
                    res.status(401).send({result:'Unauthorized',message:password});
                }
            }else{
                res.status(400).send({result:'Not Found',message:user});
            }
        }
    }catch(err){
        res.status(400).send({error:`Error en login:${err}`});
    }
});

sessionRouter.get('/logout',async(req,res)=>{ 
    if(req.session.login){
        req.session.destroy();
    }
    res.status(200).send({result:'Usuario Deslogueado'});
});

export default sessionRouter;