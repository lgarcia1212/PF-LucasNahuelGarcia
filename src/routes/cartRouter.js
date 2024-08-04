import { Router } from "express";
import { createCart, getCart, insertProductCart, createTicket, getTicket } from "../controllers/cartController.js";

const cartRouter = Router();

cartRouter.post("/", createCart);
cartRouter.get("/:cid", getCart);
cartRouter.post("/:cid/:pid", insertProductCart);
cartRouter.get("/purchase/:cid", createTicket);
cartRouter.get("/ticket/:tid", getTicket);

export default cartRouter;
