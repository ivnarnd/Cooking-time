import { Router } from "express";
import { addProduct, deleteProductInCart, editProduct, getCartById, getCarts, loadingCart, purchase } from "../controllers/carts.controller.js";
import { passportError, authorization } from "../utils/messagesError.js";

const cartsRouter = Router();

cartsRouter.get('/',passportError('jwt'),authorization('user'),getCarts);
cartsRouter.get('/:cid',passportError('jwt'),authorization('user'),getCartById);
cartsRouter.delete('/:cid/products/:pid',passportError('jwt'),authorization('user'),deleteProductInCart);
cartsRouter.post('/:cid/product/:pid',passportError('jwt'),authorization('user'),addProduct);
cartsRouter.put('/:cid',passportError('jwt'),authorization('admin'),loadingCart);
cartsRouter.put('/:cid/products/:pid',passportError('jwt'),authorization('user'),editProduct);
cartsRouter.post('/:cid/purchase',passportError('jwt'),authorization('user'),purchase);

export default cartsRouter;
