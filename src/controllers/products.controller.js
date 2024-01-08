import { productModel } from "../models/products.models.js";
import createProducts  from "../models/mockingProducts.js";
export const mockingProducts = (req,res) => {
  try {
    let products = createProducts(100);
    res.status(200).send({resp:'Ok',message:products})
  } catch (error) {
    res.status(400).send({resp:'Error en consultar Productos Mocking',message:error})
  }
    
}
export const getProducts = async(req,res)=>{
    const{limit,page,query,value,sort} = req.query;
    const sortS = sort? sort:'';
    const pageS = page? page : 1;
    const limitS = limit?limit:10;
    const queryS = {};
    queryS[query]=value;
    try {
        const prods = await productModel.paginate(queryS,{limit:limitS,page:pageS,sort:{ price:`${sortS}`}});
        res.status(200).send({resp:'Ok',message:prods});
    } catch (error) {
        res.status(400).send({resp:'Error en consultar Productos',message:error})
    }
};

export const getProductById = async(req,res)=>{
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
};

export const putProductById = async(req,res)=>{
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
};

export const deleteProductById = async(req,res)=>{
    
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
};

export const postProduct = async(req,res)=>{
    const {title,description,price,thumbnail,code,stock,category} = req.body;
    try {
        const msgResp = await productModel.create({title,description,price,thumbnail,code,stock,category});
        res.status(200).send({resp:'Ok',message:msgResp});
    } catch (error) {
        res.status(400).send({resp:'Error en agregar Producto',message:error})
    }
};