import passport from "passport";
import local from "passport-local";
import { userModel } from "../models/users.models.js";
import { createHash,validatePassword } from "../utils/utils.js";
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
    ));
    passport.use('login',new localStrategy(
       {usernameField:'email'},
       async(username,password,done)=>{
           try {
               let user = await userModel.findOne({email:username});
               if (!user){
                   return done(null,false);//no se encontro un usuario ya registrado
               }
               //sino
               if(!validatePassword(user,password)){
                    return done(null,false);
               }
               //si todo salio correctamente
               done(null,user);
           } catch (error) {
               //si tengo un error 
               return done('error en registrar usuario'+error); 
           }
       }
   ));
    //serializacion de usuario
    passport.serializeUser((user,done)=>{
        done(null,user._id);
    });
    //desserializacion de usuario
    passport.deserializeUser(async(id,done)=>{
        let user = await userModel.findById(id);
        done(null,user);
    })
}
export default initializePassport;