import  jwt  from 'jsonwebtoken';
import 'dotenv/config';


export const generatejwt = (user)=>{
    const token = jwt.sign({user},process.env.JWT_SECRET,{expiresIn:"12h"});
    console.log(token);
    return token

}

generatejwt({"_id":"65564e99d5428406c0a4c8ba","first_name":"Ivan Aranda","last_name":" ","age":18,"email":"iaranda264@gmail.com","password":"$2b$10$qLejoyvot2wQLsikkIci/Oqef9dj4/mILDKwhEIPXY/7VVsdhdWFK","rol":"user","__v":0})