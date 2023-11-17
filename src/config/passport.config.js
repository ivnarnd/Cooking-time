import passport from "passport";
import local from "passport-local";
import GithubStrategy from 'passport-github2';
import jwt from 'passport-jwt';
import { userModel } from "../models/users.models.js";
import { createHash,validatePassword } from "../utils/utils.js";

const localStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt; //con esto se Extrae de las cookies el token
const initializePassport = ()=>{
    const cookieExtractor = req =>{
        console.log(req.cookies)
        const token = req.cookies.jwtCookie?req.cookies.jwtCookie:{}
        console.log("cookieExtractor"+token)
        return token
    }
    passport.use('jwt',new JWTStrategy({
        jwtFromRequest:ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey:process.env.JWT_SECRET
    },async(jwt_payload,done)=>{
        try{
            console.log("jwt",jwt_payload)
            return done(null,jwt_payload)
        }
        catch(error){
            return done(error)
        }
    }))
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
   //Estrategia de autorizacion de github
   passport.use('github', new GithubStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.SECRET_CLIENT,
    callbackURL: process.env.CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const user = await userModel.findOne({ email: profile._json.email })
        if (user) {
            done(null, false)
        } else {
            const userCreated = await userModel.create({
                first_name: profile._json.name,
                last_name: ' ',
                email: profile._json.email,
                age: 18, //Edad por defecto
                password: createHash(profile._json.email + profile._json.name)
            })
            done(null, userCreated)
        }


    } catch (error) {
        done(error)
    }
}))
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