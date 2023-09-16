import { Router } from "express";
import { cartModel } from "../models/carts.models.js";
import { productModel } from "../models/products.models.js";
const cartsRouter = Router();
cartsRouter.get('/',async(req,res)=>{
    const{limit} = req.query;
    try {
        const carts = await cartModel.find().limit(limit);
        if (carts)
            res.status(200).send({ respuesta: 'OK', mensaje: carts })
        else
            res.status(404).send({ respuesta: 'Error en consultar los Carritos', mensaje: 'Not Found' })
    } catch (error) {
        res.status(400).send({ respuesta: 'Error en consulta de carritos', mensaje: error })
    }
});
cartsRouter.get('/:cid',async(req,res)=>{
    try{
        const cart = await cartModel.findById(req.params.cid);
        if(cart){
            res.status(200).send({resp:'Ok',message:cart});
        }else{
            res.status(404).send({resp:'Error',message:'El carrito no existe'});
        }
        
    }catch(error){
        res.status(400).send({resp:'Error en consultar por un carrito',message:'Not found'});
    }
});
cartsRouter.post('/',async(req,res)=>{
    try {
        const msgResp = await cartModel.create({});
        res.status(200).send({resp:'Ok',message:msgResp});
    } catch (error) {
        res.status(400).send({resp:'Error en Crear Carrito',message:error})
    }
});
cartsRouter.post('/:cid/product/:pid',async (req,resp)=>{
    let {cid,pid} = req.params;
    let {quantity} = req.body;
    try{
        let cart = await cartModel.findById(cid);
        if(cart){
            const prod = await productModel.findById(pid);
            if(prod){
                const indice = cart.products.findIndex(item => item.id_prod == pid)
                if (indice != -1) {
                    cart.products[indice].quantity = quantity;
                } else {
                    cart.products.push({ id_prod: pid, quantity: quantity });
                }
                const res = await cartModel.findByIdAndUpdate(cid, cart);
                res.status(200).send({ respuesta: 'OK', mensaje: res });
            }else{
                resp.status(404).send({res:'Error en Agregar producto',message:`El Producto con el id ${pid} no existe`})
            }
        }else{
            resp.status(404).send({res:'Error en Agregar product',message:`El Carrito con el id ${cid} no existe`});
        }
    }catch(error){
        resp.status(400).send({res:'Error en Agregar producto al carrito',message:error});
    }
    
   
    
});
export default cartsRouter;
