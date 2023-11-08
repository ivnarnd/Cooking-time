import 'dotenv/config.js';
import  express from "express";
import mongoose from "mongoose";
import passport from 'passport';
import path from 'path';
import userRouter from "./routes/users.routes.js";
import prodsRouter from "./routes/products.routes.js";
import cartsRouter from "./routes/carts.routes.js";
import initializePassport from './config/passport.config.js';
import { messageModel } from "./models/messages.models.js";
import { Server } from "socket.io";
import { engine } from "express-handlebars";
import { __dirname } from "./path.js";

import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";//importacion de conector de mongo 
import  session  from "express-session";
import sessionRouter from './routes/sessions.routes.js';

const app = express();
const PORT=8080;

//Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
const server = app.listen(PORT,()=>console.log(`Servidor corriendo en puerto:${PORT}`));

const io = new Server(server);


io.on('connection',(socket)=>{
    console.log('Servidor socket io conectado');
    socket.on('hello',(msg)=>{
        console.log(msg);
    });
    socket.on('msg',async(infoMesage) => {
            const msgResp = await messageModel.create({email:infoMesage.user,message:infoMesage.mesage});
            const collection = await messageModel.find();
            socket.emit('mesages', collection);
    });
});




//setting engine views
app.engine('handlebars', engine()) //Defino que motor de plantillas voy a utilizar y su config
app.set('view engine', 'handlebars') //Setting de mi app de hbs
app.set('views', path.resolve(__dirname, './views')) //Resolver rutas absolutas a traves de rutas relativas
app.use('/static', express.static(path.join(__dirname, '/public'))) //Unir rutas en una sola concatenandolas

//conecction bd
mongoose.connect(process.env.URL_CODE)
    .then(()=>console.log('DB is connected'))
    .catch((error)=>console.log('Error in connection',error));

//utilizar la cookieParser -> inicializarla
//si le queremos pasar una contraseña se la damos como string
app.use(cookieParser(process.env.PASS_COOKIE));//pasarlo a .env

//utilizando el midleware
app.use(session({
    store:MongoStore.create({
        mongoUrl:process.env.URL_CODE,//pasarlo a .env
        mongoOptions:{
            useNewUrlParser:true, //manejo de conexiones a traves de url
            useUnifiedTopology:true //topologia de controlador de la base de datos
        },
        ttl:60 //duracion de la sesion en bd en segundos
    }),
    secret:process.env.PASS_SESSION,//esto pasarlo a .env
    resave:false,
    saveUninitialized:false 
}));
//configuracion de passport
initializePassport();
app.use(passsport.initialize());
app.use(passport.session());
//routes
app.use('/api/users',userRouter);
app.use('/api/products',prodsRouter);
app.use('/api/carts',cartsRouter);
app.use('/api/sessions',sessionRouter);

//funcion de autenticacion de session
function auth(req, res, next) {
 if (req.session?.infoUser) {
   return next()
 }
 return res.status(401).send('error de autorización!')
}
function authLog(req,res,next){
    if(!req.session?.login){
        return next()
    }
    return res.redirect(302,'/static/products');
}

app.use('/static/login',authLog,(req,res)=>{
    res.render('loginform',{
        css:'style.css',
        title:'Login',
        script:'login.js'
    });
});
app.use('/static/signup',authLog,(req,res)=>{
    res.render('signup',{
        css:'style.css',
        title:'Signup',
        script:'signup.js'
    });
});
app.get('/static',auth,(req,res)=>{
    res.render('webchat',{
        css:'style.css',
        title:'chat',
        script:'script.js'
    });
});

app.get('/static/products',auth,(req,res)=>{
    res.render('products',{
        css:'style.css',
        title:'Products',
        script:'products.js'
    });
});

app.get('/static/profile',auth,(req,res)=>{
    res.render('profile',{
        css:'Style.css',
        title:'Profile',
        script:'profile.js',
        user:req.session.infoUser
    })
});

