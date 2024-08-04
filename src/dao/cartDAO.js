import cartModel from "../models/cart.js";
import productModel from "../models/product.js";
import ticketModel from "../models/ticket.js";
import crypto from 'crypto';


class CartDAO {
    async getCartById(cartId) {
        try {
            return await cartModel.findById(cartId).populate('products.id_prod');
        } catch (error) {
            throw new Error(`Error al intentar obtener el carrito con ID ${cartId}: ${error.message}`);
        }
    }

    async createCart() {
        try {
            return await cartModel.create({ products: [] });
        } catch (error) {
            throw new Error(`Error al intentar crear el carrito: ${error.message}`);
        }
    }

    async addProductToCart(cartId, productId, quantity) {
        try {
            const cart = await cartModel.findById(cartId);
            if (!cart) throw new Error(`Carrito con ID ${cartId} no existe`);

            const index = cart.products.findIndex(product => product.id_prod.toString() === productId.toString());
            if (index !== -1) {
                cart.products[index].quantity = quantity;
            } else {
                cart.products.push({ id_prod: productId, quantity: quantity });
            }

            return await cart.save();
        } catch (error) {
            throw new Error(`Error al intentar agregar producto al carrito con ID ${cartId}: ${error.message}`);
        }
    }

    async clearCart(cartId) {
        try {
            return await cartModel.findByIdAndUpdate(cartId, { products: [] }, { new: true });
        } catch (error) {
            throw new Error(`Error al intentar vaciar el carrito con ID ${cartId}: ${error.message}`);
        }
    }

    async createTicket(cartId, userEmail) {
        try {
            const cart = await cartModel.findById(cartId).populate('products.id_prod');
            if (!cart) throw new Error('Carrito inexistente');
            
            const prodSinStock = [];
            const productsToUpdate = [];

            for (const prod of cart.products) {
                const producto = await productModel.findById(prod.id_prod);
                if (!producto || producto.stock < prod.quantity) {
                    prodSinStock.push(prod.id_prod.toString());
                } else {
                    productsToUpdate.push({
                        id: prod.id_prod,
                        quantity: prod.quantity
                    });
                }
            }

            if (prodSinStock.length === 0) {
                const totalPrice = cart.products.reduce((total, prod) => total + (prod.id_prod.price * prod.quantity), 0);

                const newTicket = await ticketModel.create({
                    code: crypto.randomUUID(),
                    purchaser: userEmail,
                    amount: totalPrice,
                    products: cart.products
                });

                for (const { id, quantity } of productsToUpdate) {
                    await productModel.findByIdAndUpdate(id, { $inc: { stock: -quantity } });
                }

                await cartModel.findByIdAndUpdate(cartId, { products: [] });
                return newTicket;
            } else {
                cart.products = cart.products.filter(pro => !prodSinStock.includes(pro.id_prod.toString()));
                await cartModel.findByIdAndUpdate(cartId, { products: cart.products });
                throw new Error(`Productos sin stock: ${prodSinStock}`);
            }
        } catch (error) {
            throw new Error(`Error al intentar crear ticket: ${error.message}`);
        }
    }
}

export default new CartDAO();
