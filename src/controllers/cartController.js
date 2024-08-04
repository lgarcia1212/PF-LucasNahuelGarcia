import cartModel from "../models/cart.js";
import productModel from "../models/product.js";
import ticketModel from "../models/ticket.js";
import crypto from "crypto";


export const getCart = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await cartModel.findById(cartId).populate("products.id_prod");
    if (!cart) return res.status(404).send("Carrito inexistente.");
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).send(`Error interno del servidor al intentar consultar el carrito: ${error.message}`);
  }
};

export const createCart = async (req, res) => {
  try {
    const cart = await cartModel.create({ products: [] });
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).send(`Error interno del servidor al intentar crear el carrito: ${error.message}`);
  }
};

export const insertProductCart = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const { quantity } = req.body;
    const cart = await cartModel.findById(cartId);

    if (!cart) return res.status(404).send("Carrito inexistente.");

    const index = cart.products.findIndex(product => product.id_prod == productId);

    if (index !== -1) {
      cart.products[index].quantity = quantity;
    } else {
      cart.products.push({ id_prod: productId, quantity });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).send(`Error interno del servidor al intentar insertar el producto: ${error.message}`);
  }
};

export const createTicket = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await cartModel.findById(cartId).populate("products.id_prod");
    if (!cart) return res.status(404).send("Carrito inexistente.");

    const outOfStockProducts = [];

    for (const prod of cart.products) {
      const product = await productModel.findById(prod.id_prod);
      if (!product || product.stock < prod.quantity) {
        outOfStockProducts.push(prod.id_prod);
      }
    }

    if (outOfStockProducts.length === 0) {
      const totalPrice = cart.products.reduce((total, prod) => total + prod.id_prod.price * prod.quantity, 0);

      const newTicket = await ticketModel.create({
        code: crypto.randomUUID(),
        purchaser: req.user.email,
        amount: totalPrice,
        products: cart.products,
      });

      await Promise.all(cart.products.map(prod =>
        productModel.findByIdAndUpdate(prod.id_prod, { $inc: { stock: -prod.quantity } })
      ));

      await cartModel.findByIdAndUpdate(cartId, { products: [] });
      res.status(200).json({ ticketId: newTicket._id });
    } else {
      cart.products = cart.products.filter(prod => !outOfStockProducts.includes(prod.id_prod));
      await cartModel.findByIdAndUpdate(cartId, { products: cart.products });
      res.status(400).send(`Productos sin stock: ${outOfStockProducts}`);
    }
  } catch (error) {
    console.error("Error interno del servidor:", error);
    res.status(500).send(`Error interno del servidor: ${error.message}`);
  }
};

export const getTicket = async (req, res) => {
  try {
    const ticketId = req.params.tid;
    const ticket = await ticketModel.findById(ticketId).populate("products.id_prod");
    if (!ticket) return res.status(404).send("Ticket inexistente.");
    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).send(`Error interno del servidor al intentar consultar el ticket: ${error.message}`);
  }
};
