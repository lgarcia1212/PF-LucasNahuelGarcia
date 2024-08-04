import { userModel } from "../models/user.js";

class UserDAO {
    async getAllUsers() {
        try {
            return await userModel.find();
        } catch (error) {
            throw new Error(`Error al intentar obtener los usuarios: ${error.message}`);
        }
    }

    async getUserById(userId) {
        try {
            const user = await userModel.findById(userId);
            if (!user) throw new Error(`Usuario con ID ${userId} no existe`);
            return user;
        } catch (error) {
            throw new Error(`Error al intentar obtener el usuario con ID ${userId}: ${error.message}`);
        }
    }

    async createUser(userData) {
        try {
            const newUser = new userModel(userData);
            return await newUser.save();
        } catch (error) {
            throw new Error(`Error al intentar crear el usuario: ${error.message}`);
        }
    }

    async updateUser(userId, updateData) {
        try {
            const updatedUser = await userModel.findByIdAndUpdate(userId, updateData, { new: true });
            if (!updatedUser) throw new Error(`Usuario con ID ${userId} no existe`);
            return updatedUser;
        } catch (error) {
            throw new Error(`Error al intentar actualizar el usuario con ID ${userId}: ${error.message}`);
        }
    }

    async deleteUser(userId) {
        try {
            const deletedUser = await userModel.findByIdAndDelete(userId);
            if (!deletedUser) throw new Error(`Usuario con ID ${userId} no existe`);
            return deletedUser;
        } catch (error) {
            throw new Error(`Error al intentar eliminar el usuario con ID ${userId}: ${error.message}`);
        }
    }

    async addDocuments(userId, documents) {
        try {
            if (!Array.isArray(documents)) {
                throw new Error('Documents debe ser un array');
            }

            const user = await userModel.findById(userId);
            if (!user) throw new Error(`Usuario con ID ${userId} no existe`);

            user.documents.push(...documents);
            return await user.save();
        } catch (error) {
            throw new Error(`Error al intentar añadir documentos al usuario con ID ${userId}: ${error.message}`);
        }
    }
}

export default new UserDAO();
