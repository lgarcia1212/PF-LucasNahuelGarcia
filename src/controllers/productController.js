import productModel from "../models/product.js";


export const getProducts = async (req, res) => {
  try {
    const { limit = 10, page = 1, filter, ord } = req.query;

    let filterQuery = {};
    if (filter === "true" || filter === "false") {
      filterQuery.status = filter;
    } else if (filter) {
      filterQuery.category = filter;
    }

    const sortQuery = ord ? { price: ord } : {};

    const products = await productModel.paginate(filterQuery, {
      limit,
      page,
      sort: sortQuery,
    });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).send(`Error interno del servidor al intentar obtener productos: ${error.message}`);
  }
};

export const getProduct = async (req, res) => {
  try {
    const productId = req.params.pid;
    const product = await productModel.findById(productId);
    if (!product) return res.status(404).send("Producto inexistente.");
    res.status(200).json(product);
  } catch (error) {
    res.status(500).send(`Error interno del servidor al intentar consultar el producto: ${error.message}`);
  }
};

export const createProduct = async (req, res) => {
  try {
    if (req.user.rol !== "Admin") {
      return res.status(403).send("Usuario no autorizado para realizar la operación.");
    }
    const product = req.body;
    const newProduct = await productModel.create(product);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).send(`Error interno del servidor al intentar crear el producto: ${error.message}`);
  }
};

export const updatedProduct = async (req, res) => {
  try {
    if (req.user.rol !== "Admin") {
      return res.status(403).send("Usuario no autorizado para realizar la operación.");
    }
    const productId = req.params.pid;
    const updatedProduct = req.body;
    const product = await productModel.findByIdAndUpdate(productId, updatedProduct, { new: true });
    if (!product) return res.status(404).send("Producto inexistente.");
    res.status(200).json(product);
  } catch (error) {
    res.status(500).send(`Error interno del servidor al intentar actualizar el producto: ${error.message}`);
  }
};

export const deleteProduct = async (req, res) => {
  try {
    if (req.user.rol !== "Admin") {
      return res.status(403).send("Usuario no autorizado para realizar la operación.");
    }
    const productId = req.params.pid;
    const result = await productModel.findByIdAndDelete(productId);
    if (!result) return res.status(404).send("Producto inexistente.");
    res.status(200).send("Producto eliminado exitosamente.");
  } catch (error) {
    res.status(500).send(`Error interno del servidor al intentar eliminar el producto: ${error.message}`);
  }
};
