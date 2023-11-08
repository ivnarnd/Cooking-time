import { Router } from "express";
import { userModel } from "../models/users.models.js";
import {validatePassword} from '../utils/utils.js';
import passport from "passport";
const sessionRouter = Router();
//ruta de registro de usuario
sessionRouter.post('/register',passport.authenticate('register'),async(req,res)=>{
    res.send({status:'sucess',message:'Usuario logueado'});
});
sessionRouter.post('/login',async(req,res)=>{
    const {email,password} = req.body;
    try{
        if(req.session.login){
            res.redirect(302,'/static/products')
        }else{
            const user = await userModel.findOne({email:email});
            if (user){
                if (validatePassword(user,password)){
                    let infoUser = {
                         name:user.first_name,
                         lastname:user.last_name,
                         age:user.age,
                         email:user.email
                        };
                    if(user.rol == "admin"){
                        req.session.admin = true;
                    }
                    req.session.login = true;
                    req.session.infoUser=infoUser;
                    res.redirect(302,'/static/products');
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
    res.redirect(302,'/static/login');
});

export default sessionRouter;