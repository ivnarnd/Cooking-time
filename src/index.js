import  Express from "express";
import userRouter from "./routes/users.routes.js";
import mongoose from "mongoose";
const app = Express();
const PORT=8080;
mongoose.connect(`mongodb+srv://ivnarnd:${process.env.PASSWORD}@cluster0.3ykyt9n.mongodb.net/?retryWrites=true&w=majority`).then(()=>console.log('DB is connected')).catch((error)=>console.log('Error in connection',error));
app.use(Express.json());
app.use('/api/users',userRouter);
app.listen(PORT,()=>console.log(`Servidor corriendo en puerto:${PORT}`));