import productModel from "../models/product.js";


class ProductDAO {
    async getAllProducts(query, options) {
        try {
            return await productModel.paginate(query, options);
        } catch (error) {
            throw new Error(`Error al intentar obtener los productos: ${error.message}`);
        }
    }

    async getProductById(productId) {
        try {
            const product = await productModel.findById(productId);
            if (!product) throw new Error(`Producto con ID ${productId} no existe`);
            return product;
        } catch (error) {
            throw new Error(`Error al intentar obtener el producto con ID ${productId}: ${error.message}`);
        }
    }

    async createProduct(productData) {
        try {
            const newProduct = new productModel(productData);
            return await newProduct.save();
        } catch (error) {
            throw new Error(`Error al intentar crear el producto: ${error.message}`);
        }
    }

    async updateProduct(productId, updateData) {
        try {
            const updatedProduct = await productModel.findByIdAndUpdate(productId, updateData, { new: true });
            if (!updatedProduct) throw new Error(`Producto con ID ${productId} no existe`);
            return updatedProduct;
        } catch (error) {
            throw new Error(`Error al intentar actualizar el producto con ID ${productId}: ${error.message}`);
        }
    }

    async deleteProduct(productId) {
        try {
            const deletedProduct = await productModel.findByIdAndDelete(productId);
            if (!deletedProduct) throw new Error(`Producto con ID ${productId} no existe`);
            return deletedProduct;
        } catch (error) {
            throw new Error(`Error al intentar eliminar el producto con ID ${productId}: ${error.message}`);
        }
    }
}

export default new ProductDAO();
