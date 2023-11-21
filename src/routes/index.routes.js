import userRouter from "./users.routes.js";
import prodsRouter from "./products.routes.js";
import cartsRouter from "./carts.routes.js";
import sessionRouter from './sessions.routes.js';
import { Router } from "express";

const indexRouter = Router();

indexRouter.use('/api/users',userRouter);
indexRouter.use('/api/products',prodsRouter);
indexRouter.use('/api/carts',cartsRouter);
indexRouter.use('/api/sessions',sessionRouter);

export default indexRouter;