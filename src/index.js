import  express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/users.routes.js";
import prodsRouter from "./routes/products.routes.js";
import cartsRouter from "./routes/carts.routes.js";
import { Server } from "socket.io";
import { engine } from "express-handlebars";
import { __dirname } from "./path.js";
import path from 'path';

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
});
app.engine('handlebars', engine()) //Defino que motor de plantillas voy a utilizar y su config
app.set('view engine', 'handlebars') //Setting de mi app de hbs
app.set('views', path.resolve(__dirname, './views')) //Resolver rutas absolutas a traves de rutas relativas
app.use('/static', express.static(path.join(__dirname, '/public'))) //Unir rutas en una sola concatenandolas
mongoose.connect(`mongodb+srv://ivnarnd:@cluster0.3ykyt9n.mongodb.net/?retryWrites=true&w=majority`).then(()=>console.log('DB is connected')).catch((error)=>console.log('Error in connection',error));

app.use('/api/users',userRouter);
app.use('/api/products',prodsRouter);
app.use('/api/carts',cartsRouter);
app.get('/static',(req,res)=>{
    res.render('webchat');
})

