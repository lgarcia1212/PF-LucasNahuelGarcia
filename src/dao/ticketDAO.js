import ticketModel from "../models/ticket.js";


class TicketDAO {
    async getAllTickets() {
        try {
            return await ticketModel.find();
        } catch (error) {
            throw new Error(`Error al intentar obtener los tickets: ${error.message}`);
        }
    }

    async getTicketById(ticketId) {
        try {
            const ticket = await ticketModel.findById(ticketId);
            if (!ticket) throw new Error(`Ticket con ID ${ticketId} no existe`);
            return ticket;
        } catch (error) {
            throw new Error(`Error al intentar obtener el ticket con ID ${ticketId}: ${error.message}`);
        }
    }

    async createTicket(ticketData) {
        try {
            const newTicket = new ticketModel(ticketData);
            return await newTicket.save();
        } catch (error) {
            throw new Error(`Error al intentar crear el ticket: ${error.message}`);
        }
    }

    async updateTicket(ticketId, updateData) {
        try {
            const updatedTicket = await ticketModel.findByIdAndUpdate(ticketId, updateData, { new: true });
            if (!updatedTicket) throw new Error(`Ticket con ID ${ticketId} no existe`);
            return updatedTicket;
        } catch (error) {
            throw new Error(`Error al intentar actualizar el ticket con ID ${ticketId}: ${error.message}`);
        }
    }

    async deleteTicket(ticketId) {
        try {
            const deletedTicket = await ticketModel.findByIdAndDelete(ticketId);
            if (!deletedTicket) throw new Error(`Ticket con ID ${ticketId} no existe`);
            return deletedTicket;
        } catch (error) {
            throw new Error(`Error al intentar eliminar el ticket con ID ${ticketId}: ${error.message}`);
        }
    }

    async addProductToTicket(ticketId, product) {
        try {
            const ticket = await ticketModel.findById(ticketId);
            if (!ticket) throw new Error(`Ticket con ID ${ticketId} no existe`);
            
            ticket.products.push(product);
            return await ticket.save();
        } catch (error) {
            throw new Error(`Error al intentar añadir producto al ticket con ID ${ticketId}: ${error.message}`);
        }
    }
}

export default new TicketDAO();
