import { Router } from "express";
import { deleteProductById, getProductById, getProducts, postProduct, putProductById } from "../controllers/products.controller.js";
import { passportError, authorization } from "../utils/messagesError.js";
const prodsRouter = Router();

prodsRouter.get('/',getProducts);
prodsRouter.get('/:pid',getProductById);
prodsRouter.put('/:pid',passportError('jwt'),authorization('admin'),putProductById);
prodsRouter.delete('/:pid',passportError('jwt'),authorization('admin'),deleteProductById);
prodsRouter.post('/',passportError('jwt'),authorization('admin'),postProduct);

export default prodsRouter;