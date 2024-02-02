import { userModel } from "../models/users.models.js";
import {createHash} from '../utils/utils.js';
import { sendRecoveryMail } from "../config/nodemailer.js";
import crypto from 'crypto';//para generar el token de 1hr de reset
export const getUsers = async(req,res)=>{
    try {
        const users = await userModel.find();
        res.status(200).send({resp:'Ok',message:users});
    } catch (error) {
        res.status(400).send({resp:'Error en consultar Usuarios',message:error})
    }
};
const recoveryLinks = {}
export const sendRecoverylink = async(req,res)=>{
    //enviar mail
    const { email } = req.body
    try {
        let exist = await userModel.find({email});
        if (exist.length == 1 ){
            const token = crypto.randomBytes(20).toString('hex'); // Token unico de recuperacion
            recoveryLinks[token] = { email: email, timestamp: Date.now() };
            const recoveryLink = `http://localhost:${process.env.PORT}/api/users/reset-password/${token}`;
            sendRecoveryMail(email, recoveryLink);
            res.status(200).send('Correo de recuperacion enviado');
        }else{
            res.status(404).send(`Error, el Email no es valido`);
        }
    } catch (error) {
        res.status(500).send(`Error al enviar el mail ${error}`)
    }
};
export const resetPassword = async(req,res)=>{
        //recuperar la contraseña
        const { token } = req.params
        let { newPassword, newPassword2 } = req.body
        try {
            const linkData = recoveryLinks[token]
            if (linkData && Date.now() - linkData.timestamp <= 3600000) {
                const { email } = linkData
                if (newPassword == newPassword2) {
                    //Modificar usuario con nueva contraseña}
                    newPassword = createHash(newPassword);
                    let userBD = await userModel.find({email});
                    userBD = userBD[0];
                    userBD.password = newPassword;
                    let update = await userModel.findByIdAndUpdate(userBD._id,userBD);
                    if (update){
                        delete recoveryLinks[token];
                        res.status(200).send('Contraseña modificada correctamente')
                    }else{
                        res.status(404).send('El usuario no se encuentra en la BD');    
                    }
                    
                } else {
                    res.status(400).send('Las contraseñas deben ser identicas')
                }
            } else {
                res.status(400).send('Token invalido o expirado. Pruebe nuevamente')
            }
        } catch (error) {
            res.status(500).send(`Error al modificar contraseña ${error}`)
        } 
}
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