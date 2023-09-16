import { Router } from "express";
import { productModel } from "../models/products.models";
const prodsRouter = Router();
prodsRouter.get('/',async(req,res)=>{
    const{limit} = req.query;
    try {
        const prods = await productModel.find().limit(limit);
        res.status(200).send({resp:'Ok',message:prods});
    } catch (error) {
        res.status(400).send({resp:'Error en consultar Productos',message:error})
    }
});
prodsRouter.get('/:pid',async(req,res)=>{
    try{
        const prod = await productModel.findById(req.params.pid);
        if(prod){
            res.status(200).send({resp:'Ok',message:prod});
        }else{
            res.status(404).send({resp:'Error',message:'El producto no existe'});
        }
        
    }catch(error){
        res.status(400).send({resp:'Error en consultar por un producto',message:'Not found'});
    }
});
prodsRouter.put('/:pid',async(req,res)=>{
    const {title,description,price,thumbnail,code,stock,category,status} = req.body;
    try{
        const prod = await productModel.findByIdAndUpdate(req.params.pid,{title,description,price,thumbnail,code,stock,category,status});
        if(prod){
            res.status(200).send({resp:'Ok',message:prod});
        }else{
            res.status(404).send({resp:'Error',message:'El producto no existe'});
        }
        
    }catch(error){
        res.status(400).send({resp:'Error en actualizar por un producto',message:'Not found'});
    }
});
prodsRouter.delete('/:pid',async(req,res)=>{
    
    try{
        const prod = await productModel.findByIdAndDelete(req.params.pid);
        if(prod){
            res.status(200).send({resp:'Ok',message:prod});
        }else{
            res.status(404).send({resp:'Error en eliminar',message:'El producto no existe'});
        }
        
    }catch(error){
        res.status(400).send({resp:'Error en eliminar un producto',message:'Not found'});
    }
});
prodsRouter.post('/',async(req,res)=>{
    const {title,description,price,thumbnail,code,stock,category} = req.body;
    try {
        const msgResp = await productModel.create({title,description,price,thumbnail,code,stock,category});
        res.status(200).send({resp:'Ok',message:msgResp});
    } catch (error) {
        res.status(400).send({resp:'Error en agregar Producto',message:error})
    }
});

export default prodsRouter;