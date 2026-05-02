import prisma from "../../Config/prismaClient.js";
import CMSRepository from "./cms.repository.js";
import CMSService from "./cms.service.js";
import CMSController from "./cms.controller.js";

const cmsRepository = new CMSRepository(prisma);
const cmsService = new CMSService(cmsRepository);
const cmsController = new CMSController(cmsService);

export default cmsController;
