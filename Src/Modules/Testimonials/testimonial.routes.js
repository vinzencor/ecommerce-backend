import { Router } from "express";
import testimonialController from "./testimonial.container.js";
import authenticateAdmin from "../../Middlewares/adminAuthenticate.js";

const router = Router();

// Public routes
router.get("/active", testimonialController.getActiveTestimonials.bind(testimonialController));

// Admin routes
router.use(authenticateAdmin);
router.post("/", testimonialController.createTestimonial.bind(testimonialController));
router.get("/all", testimonialController.getAllTestimonials.bind(testimonialController));
router.put("/:id", testimonialController.updateTestimonial.bind(testimonialController));
router.delete("/:id", testimonialController.deleteTestimonial.bind(testimonialController));

export default router;
