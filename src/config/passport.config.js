import passport from "passport";
import local from "passport-local";
import { userModel } from "../models/users.models";
import { createHash,validatePassword } from "../utils/utils";
const localStrategy = local.Strategy;
const initializePassport = ()=>{
    //done sera el callback de resolucion de passport, el primer argumento es para error y el segundo para el usuario.
    passport.use('register',new localStrategy(
         //passReqToCallback permite que se pueda acceder al objeto req como un objeto
        {passReqToCallback:true,usernameField:'email'},
        async(req,username,password,done)=>{
            const {first_name,last_name,email,age}=req.body;
            try {
                let user = await userModel.findOne({email:username});
                if (user){
                    return done(null,false);//se encontro un usuario ya registrado
                }
                //sino
                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password:createHash(password)
                }//con esto creamos un usuario
                let result = await userModel.create(newUser);
                //si todo salio correctamente
                done(null,result);
            } catch (error) {
                //si tengo un error 
                return done('error en registrar usuario'+error); 
            }
        }
    ))
}