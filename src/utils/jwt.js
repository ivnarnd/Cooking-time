import  jwt  from 'jsonwebtoken';
import 'dotenv/config';


export const generatejwt = (user)=>{
    const token = jwt.sign({user},'CODER',{expiresIn:"12h"});
    console.log(token);
    return token

}

generatejwt({"_id":"65564e99d5428406c0a4c8ba","first_name":"Ivan Aranda","last_name":" ","age":18,"email":"iaranda264@gmail.com","password":"$2b$10$qLejoyvot2wQLsikkIci/Oqef9dj4/mILDKwhEIPXY/7VVsdhdWFK","rol":"user","__v":0})
export const authToken = (req,res,next)=>{
    //consulta al header
    const authHeader = req.header.Authorization
    //sino tiene el token
    if(!authHeader){
        res.status(401).send({error:'Usuario no Autenticado'});
    }
    //si tengo token
    const token = authHeader.split(' ')[1]//obtengo el token y descarto el Bearer
    jwt.sign(token,process.env.JWT_SECRET,(error,credential)=>{
        if(error){
            return res.status(403).send({error:'Usuario no Autorizado Token Invalido'})
        }
        //usuario valido
        req.user = credential.user
        next()
    })
    
}