import {Schema,model} from "mongoose";
import { v4 as uuidv4 } from 'uuid';
const ticketSchema = new Schema({
    code: uuidv4(),
    purchase_datetime:Date.now(),
    amount:{
        type:Number,
        require:true
    },
    purchaser:{
        type:String,
        require:true
    }
});
export const ticketModel = model('tickets',ticketSchema);