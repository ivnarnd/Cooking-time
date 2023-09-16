import  Express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/users.routes.js";
import prodsRouter from "./routes/products.routes.js";
import cartsRouter from "./routes/carts.routes.js";

const app = Express();
const PORT=8080;

mongoose.connect(`mongodb+srv://ivnarnd:@cluster0.3ykyt9n.mongodb.net/?retryWrites=true&w=majority`).then(()=>console.log('DB is connected')).catch((error)=>console.log('Error in connection',error));

app.use(Express.json());
app.use('/api/users',userRouter);
app.use('/api/products',prodsRouter);
app.use('/api/carts',cartsRouter);

app.listen(PORT,()=>console.log(`Servidor corriendo en puerto:${PORT}`));