import {Schema,model} from "mongoose";
const productSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    stock:{
        type:Number,
        required:true
    },
    category:{
        type:String,
        unique:true
    },
    status:{
        type:Boolean,
        default:true
    },
    code:{
        type:String,
        required:true,
        unique:true
    },
    thumbnail:[]
    
});
export const userModel = model('users',productSchema);