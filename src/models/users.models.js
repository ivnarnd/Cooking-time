import {Schema,model} from "mongoose";
const userSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    age:Number,
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    }
    
});
export const userModel = model('users',userSchema);