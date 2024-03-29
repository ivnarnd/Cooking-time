import {Schema,model} from "mongoose";
import {cartModel} from './carts.models.js';
const userSchema = new Schema({
    first_name:{
        type:String,
        required:true
    },
    last_name:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    rol:{
        type:String,
        default:'user'
    },
    cart:{
        type:Schema.Types.ObjectId,
        ref:'carts'
    },
    premium:{
        type:Boolean,
        default:false
    }
    
});
userSchema.pre('save',async function(next){
    try {
        const newCart = await cartModel.create({});
        this.cart = newCart._id;
        
    } catch (error) {
        next(error)
    }
});
export const userModel = model('users',userSchema);