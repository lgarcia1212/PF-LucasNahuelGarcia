import { Router } from 'express';
import { getProducts, getProduct, createProduct, updatedProduct, deleteProduct } from '../controllers/productController.js';

const productsRouter = Router();

productsRouter.get('/', getProducts);
productsRouter.get('/:id', getProduct);
productsRouter.post('/', createProduct);
productsRouter.put('/:id', updatedProduct);
productsRouter.delete('/:id', deleteProduct);

export default productsRouter;
