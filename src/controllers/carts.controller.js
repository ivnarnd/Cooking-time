import { cartModel } from "../models/carts.models.js";
import { productModel } from "../models/products.models.js";
import { ticketModel } from "../models/tickets.models.js";


export const getCarts = async(req,res)=>{
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
};

export const getCartById = async(req,res)=>{
    try{
        const cart = await cartModel.findById(req.params.cid).populate('products.id_prod');
        if(cart){
            res.status(200).send({resp:'Ok',message:cart});
        }else{
            res.status(404).send({resp:'Error',message:'El carrito no existe'});
        }
        
    }catch(error){
        res.status(400).send({resp:'Error en consultar por un carrito',message:'Not found'});
    }
};

export const deleteProductInCart = async (req,resp)=>{
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
};

export const addProduct = async (req,resp)=>{
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
};

export const loadingCart =async (req,resp)=>{
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
};

export const editProduct = async (req,resp)=>{
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
};
export const purchase = async (req,res)=>{
    let {cid} = req.params; //id del carrito
    let purchaser = req.user.user.email; //email del usuario que genera el ticket
    let montoTot = 0;//monto total para generacion de ticket
    let prodsOK = [];//productos con stock disponible para la compra
    let prodsSinStock = [];//productos sin stock
    try{
        //obtengo el carrito
        let cart = await cartModel.findById(cid);
        //si el carrito no existe
        if (!cart){
            res.status(404).send({res:'Error en Finalizacion de compra',message:`El Carrito con el id ${cid} no existe`});
        }
        //si el carrito no tiene productos
        if (cart.products.length == 0){
            res.status(404).send({res:'Error en Finalizacion de compra',message:`El Carrito con el id ${cid} no contiene productos agregados`});
        }else{
        //sino recorro todos los productos del carrito
        for (let index = 0; index < cart.products.length; index++) {
            const prod= cart.products[index];
            const id = prod.id_prod;//id del producto agregado al carrito
            let prodBD = await productModel.findById(id);//obtengo el producto de la bd
            //si tengo stock disponible
            if( prod.quantity <= prodBD.stock){
                prodBD.stock = prodBD.stock - prod.quantity;//descuento el stock de la bd
                //actualizo el producto en la bd
                await productModel.findByIdAndUpdate(id,prodBD);
                //actualizo el montoTotal
                montoTot = montoTot + (prod.quantity * prodBD.price )
                //actualizo la quantity de los que se realizaron
                prod.quantity = 0;
                
            }else{
                //almaceno el producto que no pudo ser comprado
                prodsSinStock.push(prod);
            }
                
        }
        //si hay productos con stock para la compra
        if(montoTot>0){
            //creo el ticket
            let ticketok = await ticketModel.create({amount:montoTot,purchaser:purchaser});
            if(ticketok){
                // actualizo cart con los productos que quedaron sin vender
                cart.products = prodsSinStock;
                let productsok = await cartModel.findByIdAndUpdate(cid,cart);
                if (productsok){
                    res.status(200).send({message:"exito"});
                }
            }
        }else{
            return res.status(400).send({ message: `No hay suficiente stock para los productos del carrito` });
        }

        }
    }
    catch(error){
        res.status(400).send({res:'Error en Finalizacion del carrito',message:error});
    }
};