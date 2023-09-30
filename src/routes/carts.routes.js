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
cartsRouter.delete('/:cid/products/:pid',async (req,resp)=>{
    let {cid,pid} = req.params;
    try{
        let cart = await cartModel.findById(cid);
        if(cart){
            const prod = await productModel.findById(pid);
            if(prod){
                const indice = cart.products.findIndex(item => item.id_prod == pid)
                if (indice !== -1) {
                    cart.products = cart.products.filter((el)=> el.id_prod != pid );
                    const resUp = await cartModel.findByIdAndUpdate(cid, cart);
                    resp.status(200).send({ respuesta: 'OK', mensaje: resUp });
                } else {
                    resp.status(404).send({res:'Error en Eliminar producto',message:`El Producto con el id ${pid} no existe en el carrito`})
                }
            }else{
                resp.status(404).send({res:'Error en Eliminar producto',message:`El Producto con el id ${pid} no existe`})
            }
        }else{
            resp.status(404).send({res:'Error en Eliminar producto',message:`El Carrito con el id ${cid} no existe`});
        }
    }catch(error){
        resp.status(400).send({res:'Error en Eliminar producto al carrito',message:error});
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
                if (indice !== -1) {
                    cart.products[indice].quantity = quantity;
                } else {
                    cart.products.push({ id_prod: pid, quantity: quantity });
                }
                const resUp = await cartModel.findByIdAndUpdate(cid, cart);
                resp.status(200).send({ respuesta: 'OK', mensaje: resUp });
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
cartsRouter.put('/:cid',async (req,resp)=>{
    let {cid} = req.params;
    let {products} = req.body;
    try{
        let cart = await cartModel.findById(cid);
        if(cart){
            cart.products = products;
            const resUp = await cartModel.findByIdAndUpdate(cid, cart);
            resp.status(200).send({ respuesta: 'OK', mensaje: resUp });
        }else{
            resp.status(404).send({res:'Error en Agregar productos',message:`El Carrito con el id ${cid} no existe`});
        }
    }
    catch(error){
        resp.status(400).send({res:'Error en Agregar productos al carrito',message:error});
    }
});
cartsRouter.put('/:cid/products/:pid',async (req,resp)=>{
    let {cid,pid} = req.params;
    let {quantity} = req.body;
    try{
        let cart = await cartModel.findById(cid);
        if(cart){
            const prod = await productModel.findById(pid);
            if(prod){
                const indice = cart.products.findIndex(item => item.id_prod == pid)
                if (indice !== -1) {
                    cart.products[indice].quantity = quantity;
                    const resUp = await cartModel.findByIdAndUpdate(cid, cart);
                    resp.status(200).send({ respuesta: 'OK', mensaje: resUp });
                }else{
                    resp.status(404).send({res:'Error en Editar producto',message:`El Producto con el id ${pid} no existe en el carrito`});
                }
            }
            else{
                resp.status(404).send({res:'Error en Editar producto',message:`El Producto con el id ${pid} no existe`})
            }
        }else{
            resp.status(404).send({res:'Error en Editar producto',message:`El Carrito con el id ${cid} no existe`});
        }
    }catch(error){
        resp.status(400).send({res:'Error en Editar producto',message:error});
    }
});
export default cartsRouter;
