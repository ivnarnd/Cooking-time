import { Router } from "express";
import passport from "passport";
import { generatejwt } from "../utils/jwt.js";
import { authorization,passportError} from "../utils/messagesError.js";
const sessionRouter = Router();
//ruta de registro de usuario
sessionRouter.post('/register',passport.authenticate('register'),async(req,res)=>{
    res.send({status:'sucess',message:'Usuario logueado'});
});
sessionRouter.post('/login',passport.authenticate('login'),async(req,res)=>{
    try{
        if(req.session.login){
            res.redirect(302,'/static/products')
        }else{
            if(!req.user){
                return res.status(400).send({status:'error',message:"Credenciales erroneas"})
            }
            req.session.user = {
                first_name : req.user.first_name,
                last_name : req.user.last_name,
                email:req.user.email,
                age:req.user.age
            }
            const token = generatejwt(req.user);//genero el token con el usuario
            res.cookie('jwtCookie',token,{
                maxAge:43200000 
            });
            res.redirect(302,'/static/products');
        }
    }catch(err){
        res.status(400).send({error:`Error en login:${err}`});
    }
});
sessionRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => {
    res.status(200).send({mensaje:'Usuario Registrado'})
})

sessionRouter.get('/githubCallback', passport.authenticate('github'), async (req, res) => {
    req.session.user = req.user;
    res.status(200).send({ mensaje: "Usuario logueado"});
})
sessionRouter.get('/logout',async(req,res)=>{ 
    if(req.session.login){
        req.session.destroy();
    }
    res.clearCookie('jwtCookie');
    res.redirect(302,'/static/login');
});
sessionRouter.get('/testJWT',passport.authenticate('jwt',{session:false}),(req,res)=>{
    res.send(req.user)
});
sessionRouter.get('/current',passportError('jwt'),authorization('user'),(req,res)=>{
    res.send(req.user);
});
export default sessionRouter;