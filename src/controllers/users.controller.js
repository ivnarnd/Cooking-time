import { userModel } from "../models/users.models.js";
import {createHash} from '../utils/utils.js';

export const getUsers = async(req,res)=>{
    try {
        const users = await userModel.find();
        res.status(200).send({resp:'Ok',message:users});
    } catch (error) {
        res.status(400).send({resp:'Error en consultar Usuarios',message:error})
    }
};

export const getUser = async(req,res)=>{
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
};

export const postUser = async(req,res)=>{
    const {first_name,last_name,age,email,password} = req.body;
    try {
        const msgResp = await userModel.create({
            first_name:first_name,
            last_name:last_name,
            age:age,
            email:email,
            password:createHash(password)
        });
        
        res.redirect(302,'/static/login');
    } catch (error) {
        console.log(error);
        res.status(400).send({resp:'Error en agregar Usuario',message:error})
    }

};

export const putUser = async(req,res)=>{
    const {id} = req.params;
    const {first_name,last_name,age,email,password} = req.body;
    try {
        const user = await userModel.findByIdAndUpdate(id,{first_name,last_name,age,email,password});
        if(user){
            res.status(200).send({resp:'Ok',message:user});
        }else{
            res.status(404).send({resp:'Error en actualizar Usuario',message:'User Not Found'});
        }
       
    } catch (error) {
        res.status(400).send({resp:'Error',message:error})
    }

};

export const deleteUser = async(req,res)=>{
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

}