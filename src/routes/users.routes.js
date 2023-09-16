import { Router } from "express";
import { userModel } from "../models/users.models.js";

const userRouter = Router();
userRouter.get('/',async(req,res)=>{
    try {
        const users = await userModel.find();
        res.status(200).send({resp:'Ok',message:users});
    } catch (error) {
        res.status(400).send({resp:'Error en consultar Usuarios',message:error})
    }

});
userRouter.get('/:id',async(req,res)=>{
    const {id} = req.params;
    try {
        const user = await userModel.findById(id);
        if(user){
            res.status(200).send({resp:'Ok',message:user});
        }else{
            res.status(404).send({resp:'Error en consultar usuario',message:'User Not Found'});
        }
       
    } catch (error) {
        res.status(400).send({resp:'Error',message:error})
    }

});

userRouter.post('/',async(req,res)=>{
    const {name,lastname,age,email,password} = req.body;
    try {
        const msgResp = await userModel.create({name,lastname,age,email,password});
        res.status(200).send({resp:'Ok',message:msgResp});
    } catch (error) {
        res.status(400).send({resp:'Error en agregar Usuario',message:error})
    }

});

userRouter.put('/:id',async(req,res)=>{
    const {id} = req.params;
    const {name,lastname,age,email,password} = req.body;
    try {
        const user = await userModel.findByIdAndUpdate(id,{name,lastname,age,email,password});
        if(user){
            res.status(200).send({resp:'Ok',message:user});
        }else{
            res.status(404).send({resp:'Error en actualizar Usuario',message:'User Not Found'});
        }
       
    } catch (error) {
        res.status(400).send({resp:'Error',message:error})
    }

});

userRouter.delete('/:id',async(req,res)=>{
    const {id} = req.params;
    
    try {
        const user = await userModel.findByIdAndDelete(id);
        if(user){
            res.status(200).send({resp:'Ok',message:user});
        }else{
            res.status(404).send({resp:'Error no se encuentra el usuario',message:'User Not Found'});
        }
       
    } catch (error) {
        res.status(400).send({resp:'Error No se pudo eliminar usuario',message:error})
    }

});

export default userRouter;