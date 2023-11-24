import { Router } from "express";
import { deleteUser, getUser, getUsers, postUser, putUser } from "../controllers/users.controller.js";
import { passportError, authorization } from "../utils/messagesError.js";
const userRouter = Router();

userRouter.get('/',passportError('jwt'),authorization('admin'),getUsers);
userRouter.get('/:id',passportError('jwt'),authorization('admin'),getUser);
userRouter.post('/',postUser);
userRouter.put('/:id',putUser);
userRouter.delete('/:id',deleteUser);

export default userRouter;