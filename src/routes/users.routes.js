import { Router } from "express";
import { deleteUser, getUser, getUsers, postUser, putUser, resetPassword, sendRecoverylink } from "../controllers/users.controller.js";
import { passportError, authorization } from "../utils/messagesError.js";
import crypto from 'crypto';//para generar el token de 1hr de reset

const userRouter = Router();

userRouter.get('/',passportError('jwt'),authorization('admin'),getUsers);
userRouter.get('/:id',passportError('jwt'),authorization('admin'),getUser);
userRouter.post('/',postUser);
userRouter.put('/:id',putUser);
userRouter.delete('/:id',deleteUser);


//rutas para la recuperacion de contraseña
userRouter.post('/password-recovery',sendRecoverylink);
userRouter.post('/reset-password/:token',resetPassword);
export default userRouter;