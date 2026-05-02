import { Router } from "express";
import cmsController from "./cms.container.js";
import authenticateAdmin from "../../Middlewares/adminAuthenticate.js";

const router = Router();

// FAQ Routes (Admin)
router.get("/faqs", authenticateAdmin, cmsController.getAllFaqs.bind(cmsController));


router.post("/faqs", authenticateAdmin, cmsController.createFaq.bind(cmsController));
router.get("/faqs/:id", authenticateAdmin, cmsController.getFaqById.bind(cmsController));
router.put("/faqs/:id", authenticateAdmin, cmsController.updateFaq.bind(cmsController));
router.delete("/faqs/:id", authenticateAdmin, cmsController.deleteFaq.bind(cmsController));

// Page Admin Routes
router.post("/", authenticateAdmin, cmsController.createPage.bind(cmsController));
router.get("/", authenticateAdmin, cmsController.getAllPages.bind(cmsController));
router.get("/details/:id", authenticateAdmin, cmsController.getPageById.bind(cmsController));
router.put("/:id", authenticateAdmin, cmsController.updatePage.bind(cmsController));
router.delete("/:id", authenticateAdmin, cmsController.deletePage.bind(cmsController));

// Public Routes (MUST be last to avoid matching admin sub-routes as slugs)
router.get("/public/pages", cmsController.getPublicPages.bind(cmsController)); // Public list
router.get("/:slug", cmsController.getPageBySlug.bind(cmsController));



export default router;


