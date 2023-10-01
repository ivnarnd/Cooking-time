import {Schema,model} from "mongoose";
const cartSchema = new Schema({
        products:{
            type: [
                {
                    id_prod: {
                        type: Schema.Types.ObjectId,
                        ref: 'products',
                        required:true,
                        index:true
                    },
                    quantity: {
                        type: Number,
                        required:true
                        
                    }
                }
            ],
            default:[]
        }
});
cartSchema.pre('find',function(){
    this.populate('products.id_prod');
});

export const cartModel = model('carts',cartSchema);