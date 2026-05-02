import prisma from "../../Config/prismaClient.js";
import TestimonialRepository from "./testimonial.repository.js";
import TestimonialService from "./testimonial.service.js";
import TestimonialController from "./testimonial.controller.js";

const testimonialRepository = new TestimonialRepository(prisma);
const testimonialService = new TestimonialService(testimonialRepository);
const testimonialController = new TestimonialController(testimonialService);

export default testimonialController;
