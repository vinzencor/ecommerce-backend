import prisma from "../../Config/prismaClient.js";
import HomeRepository from "./home.repository.js";
import HomeService from "./home.service.js";
import HomeController from "./home.controller.js";

const homeRepository = new HomeRepository(prisma);
const homeService = new HomeService(homeRepository);
const homeController = new HomeController(homeService);

export default homeController;
