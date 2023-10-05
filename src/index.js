import 'dotenv/config.js';
import  express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/users.routes.js";
import prodsRouter from "./routes/products.routes.js";
import cartsRouter from "./routes/carts.routes.js";
import { messageModel } from "./models/messages.models.js";
import { Server } from "socket.io";
import { engine } from "express-handlebars";
import { __dirname } from "./path.js";
import path from 'path';

import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";//importacion de conector de mongo 
import  session  from "express-session";

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
    resave:true,
    saveUninitialized:true 
}));

app.get('/session',(req,res)=>{
    if(req.session.counter){
        req.session.counter++;
        res.send(`Se ha visitado el sitio ${req.session.counter} veces`);
    }else{
        req.session.counter = 1;
        res.send('!Bienvenido¡');
    }
});
app.get('/logout',(req,res)=>{
    req.session.destroy(err => {
        if(!err){
            res.send('Logout Ok!');
        }else{
            res.json({status:'Logout Error',body:err});
        }
    });
});
const auth = (req,res,next)=>{
    if (req.session?.user === 'pepe' && req.session?.admin){
        return next();
    }else{
        res.status(401).send('Error de autorizacion');
    }
}
app.get('/privado',auth,(req,res)=>{
    res.send('si estas viendo estos es porque ya te logueaste');
});
app.get('/login', (req, res) => {
    const { username, password } = req.query;
    if (username !== 'pepe' || password !== 'pepepass') {
      return res.send('login failed');
    }
    req.session.user = username;
    req.session.admin = true;
    res.send('login success!');
});
   

app.get('/', (req, res) => {
    res.render('login');
});
app.get('/POST',(req,res)=>{
    let {email} = req.query;
    res.cookie('coderCookie',`user:${email}`,{maxAge:10000}).send("Cookie");
});

//enviar la cookie setearla
app.get('/setCookie',(req,res)=>{
    //si queremos setear un inicio de sesion lo determinamos como prop signed:true
    res.cookie('coderCookie','Esta es una cookie muy poderosa',{maxAge:10000,signed:true}).send("Cookie");
});
//revisar la cookie seteada
app.get('/getCookie',(req,res)=>{
    //obtenemos las cookies y las enviamos a traves de respuestas
    res.send(req.cookies);
    //si queremos enviar una en especifica
    // res.send(req.cookies.coderCookie);
});
//eliminar la cookie seteada
app.get('/deleteCookie',(req,res)=>{
    //obtenemos las cookies y las enviamos a traves de respuesta ya limpias 
    res.clearCookie('coderCookie').send('clean cookie');
    //si queremos enviar una en especifica
    // res.send(req.cookies.coderCookie);
});


//routes
app.use('/api/users',userRouter);
app.use('/api/products',prodsRouter);
app.use('/api/carts',cartsRouter);
app.get('/static',(req,res)=>{
    res.render('webchat',{
        css:'style.css',
        title:'chat'
    });
});


