import prisma from "../../Config/prismaClient.js";
import CartRepository from "./cart.repository.js";
import CartService from "./cart.service.js";
import CartController from "./cart.controller.js";
import SharedCartRepository from "./sharedCart.repository.js";

const cartRepository = new CartRepository(prisma);
const sharedCartRepository = new SharedCartRepository();
const cartService = new CartService(cartRepository, sharedCartRepository);
const cartController = new CartController(cartService);

export default cartController;
