import prisma from "../../Config/prismaClient.js";
import SupportRepository from "./support.repository.js";
import SupportService from "./support.service.js";
import SupportController from "./support.controller.js";

const supportRepository = new SupportRepository(prisma);
const supportService = new SupportService(supportRepository);
const supportController = new SupportController(supportService);

export default supportController;
