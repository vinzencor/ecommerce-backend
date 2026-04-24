import express from "express";
import authRoutes from "./Modules/Auth/auth.routes.js";
import adminAuthRoutes from "./Modules/Auth/Adminauth/adminauth.routes.js";
import categoryRoutes from "./Modules/Category/category.routes.js";
import vendorCategoryRoutes from "./Modules/Category/vendorCategory.routes.js";
import productRoutes from "./Modules/Product/product.routes.js";
import vendorProductRoutes from "./Modules/Product/vendorProduct.routes.js";
import variantRoutes from "./Modules/Variant/variant.routes.js";
import vendorVariantRoutes from "./Modules/Variant/vendorVariant.routes.js";
import offerRoutes from "./Modules/Offers/offer.routes.js";
import adminAuditLogRoutes from "./Modules/AdminAuditLog/adminAuditLog.routes.js";
import vendorAuthRoutes from "./Modules/Auth/Vendorauth/vendorauth.routes.js";
import bannerRoutes from "./Modules/Banner/banner.routes.js";
import coupansRoutes from "./Modules/Coupans/coupan.routes.js";
import adminUserRoutes from "./Modules/Users/user.routes.js";
import notificationRoutes from "./Modules/Notifications/notification.routes.js";
import vendorRoutes from "./Modules/Vendors/vendor.routes.js";
import brandRoutes from "./Modules/Brand/brand.routes.js";
import vendorBrandRoutes from "./Modules/Brand/vendorBrand.routes.js";
import dealRoutes from "./Modules/Deals/deal.routes.js";
import homeRoutes from "./Modules/Home/home.routes.js";
import wishlistRoutes from "./Modules/Wishlist/wishlist.routes.js";
import cartRoutes from "./Modules/Cart/cart.routes.js";
import coinRewardRoutes from "./Modules/CoinReward/coinReward.routes.js";
import orderRoutes from "./Modules/Order/order.routes.js";


const router = express.Router();

// set up routes
router.use("/auth", authRoutes);
router.use("/admin", adminAuthRoutes);
router.use("/admin/users", adminUserRoutes);
router.use("/admin/vendors", vendorRoutes);
router.use("/admin/coin-reward", coinRewardRoutes);
router.use("/vendor", vendorAuthRoutes);
router.use("/home", homeRoutes);
router.use("/wishlist", wishlistRoutes);
router.use("/cart", cartRoutes);
router.use("/orders", orderRoutes);
router.use("/vendor/products", vendorProductRoutes);
router.use("/vendor/brands", vendorBrandRoutes);
router.use("/vendor/categories", vendorCategoryRoutes);
router.use("/vendor/variants", vendorVariantRoutes);
router.use("/category", categoryRoutes);

router.use("/products", productRoutes);
router.use("/variants", variantRoutes);
router.use("/offers", offerRoutes);
router.use("/banners", bannerRoutes);
router.use("/admin-audit-logs", adminAuditLogRoutes);
router.use("/coupans", coupansRoutes);
router.use("/notifications", notificationRoutes);
router.use("/brands", brandRoutes);
router.use("/deals", dealRoutes);

export default router;
