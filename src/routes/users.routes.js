import { Router } from "express";
import { userModel } from "../models/users.models.js";

const userRouter = Router();
userRouter.get('/',async(req,res)=>{
    try {
        const users = await userModel.find();
        res.status(200).send({resp:'Ok',message:users});
    } catch (error) {
        res.status(400).send({resp:'Error',message:error})
    }

})