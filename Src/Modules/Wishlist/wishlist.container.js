import prisma from "../../Config/prismaClient.js";
import WishlistRepository from "./wishlist.repository.js";
import WishlistService from "./wishlist.service.js";
import WishlistController from "./wishlist.controller.js";

const wishlistRepository = new WishlistRepository(prisma);
const wishlistService = new WishlistService(wishlistRepository);
const wishlistController = new WishlistController(wishlistService);

export default wishlistController;
