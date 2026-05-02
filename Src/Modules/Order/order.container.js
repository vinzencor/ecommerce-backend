import prisma from "../../Config/prismaClient.js";
import OrderRepository from "./order.repository.js";
import OrderService from "./order.service.js";
import OrderController from "./order.controller.js";
import CartRepository from "../Cart/cart.repository.js";
import RefundRepository from "../Refunds/refund.repository.js";

const orderRepository = new OrderRepository(prisma);
const cartRepository = new CartRepository(prisma);
const refundRepository = new RefundRepository(prisma);
const orderService = new OrderService(orderRepository, cartRepository, refundRepository);
const orderController = new OrderController(orderService);

export default orderController;
