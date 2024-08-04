import { userModel } from "../models/user.js";


export const getUsers = async () => {
  try {
    const users = await userModel.find({}, "first_name last_name email rol");
    return users;
  } catch (error) {
    throw new Error(`Error al intentar obtener los usuarios: ${error.message}`);
  }
};

export const sendDocuments = async (req, res) => {
  try {
    const { uid } = req.params;
    const newDocs = req.body;
    const user = await userModel.findByIdAndUpdate(
      uid,
      { $push: { documents: { $each: newDocs } } },
      { new: true }
    );
    if (!user) {
      return res.status(404).send("Usuario inexistente.");
    }
    res.status(200).json(user);
  } catch (e) {
    res.status(500).send(`Error al intentar enviar los documentos: ${e.message}`);
  }
};

export const deleteInactiveUsers = async () => {
  try {
    const inactiveThreshold = new Date(Date.now() - 10 * 60 * 1000);
    const inactiveUsers = await userModel.find({
      last_connection: { $lt: inactiveThreshold },
    });

    await userModel.deleteMany({ _id: { $in: inactiveUsers.map(user => user._id) } });
    return { message: "Los usuarios inactivos han sido eliminados exitosamente." };
  } catch (error) {
    throw new Error(`Error al intentar eliminar usuarios inactivos: ${error.message}`);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { uid } = req.params;
    const result = await userModel.findByIdAndDelete(uid);
    if (!result) {
      return res.status(404).send("Usuario inexistente.");
    }
    res.status(200).send("Usuario eliminado exitosamente.");
  } catch (error) {
    res.status(500).send(`Error al intentar eliminar el usuario: ${error.message}`);
  }
};
