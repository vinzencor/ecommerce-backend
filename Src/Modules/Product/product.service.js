import { isWithinRadius, calculateHaversineDistance } from "../../Utils/geoUtils.js";

class ProductService {
    constructor(productRepository, adminAuditLogService) {
        this.productRepository = productRepository;
        this.adminAuditLogService = adminAuditLogService;
    }

    _parsePayload(data) {
        if (!data) return {};
        const payload = { ...data };
        if (payload.taxPercentage !== undefined && payload.taxPercentage !== "") payload.taxPercentage = parseFloat(payload.taxPercentage);
        else if (payload.taxPercentage === "") delete payload.taxPercentage;

        if (payload.codExtraCharge !== undefined && payload.codExtraCharge !== "") payload.codExtraCharge = parseFloat(payload.codExtraCharge);
        else if (payload.codExtraCharge === "") delete payload.codExtraCharge;

        if (payload.returnDays !== undefined && payload.returnDays !== "") payload.returnDays = parseInt(payload.returnDays);
        else if (payload.returnDays === "") delete payload.returnDays;

        if (payload.lowStock !== undefined && payload.lowStock !== "") payload.lowStock = parseInt(payload.lowStock);
        else if (payload.lowStock === "") delete payload.lowStock;

        if (payload.stock !== undefined && payload.stock !== "") payload.stock = parseInt(payload.stock);
        else if (payload.stock === "") delete payload.stock;
        if (payload.codAllowed !== undefined) payload.codAllowed = payload.codAllowed === 'true' || payload.codAllowed === true;
        if (payload.returnAllowed !== undefined) payload.returnAllowed = payload.returnAllowed === 'true' || payload.returnAllowed === true;
        if (payload.isFeatured !== undefined) payload.isFeatured = payload.isFeatured === 'true' || payload.isFeatured === true;
        if (payload.addedByAdmin !== undefined) payload.addedByAdmin = payload.addedByAdmin === 'true' || payload.addedByAdmin === true;
        if (payload.isActive !== undefined) payload.isActive = payload.isActive === 'true' || payload.isActive === true;
        
        if (payload.expiryDate) {
            payload.expiryDate = new Date(payload.expiryDate);
        }

        if (payload.manufactureDate) {
            payload.manufactureDate = new Date(payload.manufactureDate);
        }

        if (payload.vendorId === "") payload.vendorId = null;
        if (payload.shopId === "") payload.shopId = null;

        if (typeof payload.highlights === 'string' && payload.highlights.trim() !== '') {
            try {
                payload.highlights = JSON.parse(payload.highlights.trim());
            } catch (e) {
                const err = new Error("Invalid JSON format for 'highlights'.");
                err.statusCode = 400;
                throw err;
            }
        }

        if (typeof payload.searchKeywords === 'string' && payload.searchKeywords.trim() !== '') {
            try {
                payload.searchKeywords = JSON.parse(payload.searchKeywords.trim());
            } catch (e) {
                payload.searchKeywords = payload.searchKeywords.split(',').map(s => s.trim());
            }
        }

        if (typeof payload.variants === 'string' && payload.variants.trim() !== '') {
            try {
                payload.variants = JSON.parse(payload.variants.trim());
            } catch (e) {
                const err = new Error("Invalid JSON format for 'variants'. Please check brackets and quotes.");
                err.statusCode = 400;
                throw err;
            }
        }

        if (typeof payload.selections === 'string' && payload.selections.trim() !== '') {
            try {
                payload.selections = JSON.parse(payload.selections.trim());
            } catch (e) {
                const err = new Error("Invalid JSON format for 'selections'.");
                err.statusCode = 400;
                throw err;
            }
        }
        return payload;
    }

    async create(data, files, adminId = null, req = null) {
        const payload = this._parsePayload(data);

        const filesByField = {};
        if (files && Array.isArray(files)) {
            files.forEach(file => {
                if (!filesByField[file.fieldname]) {
                    filesByField[file.fieldname] = [];
                }
                filesByField[file.fieldname].push(file.path);
            });
        }

        if (payload.variants && Array.isArray(payload.variants)) {
            const processedVariants = [];
            payload.variants.forEach((v, index) => {
                const variantImages = v.images && Array.isArray(v.images) ? [...v.images] : [];
                
                const fieldName = `variant_images_${index}`;
                if (filesByField[fieldName]) {
                    variantImages.push(...filesByField[fieldName]);
                }

                if (index === 0 && filesByField['images']) {
                    variantImages.push(...filesByField['images']);
                }

                const variantVideos = v.videos && Array.isArray(v.videos) ? [...v.videos] : [];
                const videoFieldName = `variant_videos_${index}`;
                if (filesByField[videoFieldName]) {
                    variantVideos.push(...filesByField[videoFieldName]);
                }


                const variantData = {
                    sku: v.sku,
                    costPrice: v.costPrice ? parseFloat(v.costPrice) : undefined,
                    price: parseFloat(v.price),
                    discount: v.discount ? parseFloat(v.discount) : 0,
                    discountedPrice: v.discountedPrice ? parseFloat(v.discountedPrice) : undefined,
                    expiryDate: v.expiryDate ? new Date(v.expiryDate) : undefined,
                    manufactureDate: v.manufactureDate ? new Date(v.manufactureDate) : undefined,
                    stock: parseInt(v.stock),
                    isPrimary: v.isPrimary,
                    images: variantImages.length > 0 ? {
                        create: variantImages.map((img, idx) => ({
                            imageUrl: img,
                            isPrimary: idx === 0
                        }))
                    } : undefined,
                    videos: variantVideos.length > 0 ? {
                        create: variantVideos.map((video, idx) => ({
                            videoUrl: video,
                            isPrimary: idx === 0
                        }))
                    } : undefined
                };

                processedVariants.push(variantData);
            });

            const processedSelections = await Promise.all(
                payload.variants.map((variant) => {
                    if (variant.selections && Array.isArray(variant.selections)) {
                        return this._processSelections(variant.selections);
                    }
                    return Promise.resolve(null);
                })
            );

            processedSelections.forEach((selectionSet, index) => {
                if (selectionSet && selectionSet.length > 0) {
                    processedVariants[index].selections = { create: selectionSet };
                }
            });

            payload.variants = { create: processedVariants };
        }

        const product = await this.productRepository.create(payload);

        if (product && this.adminAuditLogService) {
             await this.adminAuditLogService.log(
                 adminId,
                 "CREATE",
                 "Product",
                 product.id,
                 null,
                 product,
                 req
             );
         }
 
         return this._applyDiscounts(product);
    }

    async findAll(search = "", page = 1, limit = 10, categoryId = null, isActive = null, categoryActive = null, fromDate, toDate, userLat, userLng, vendorId = null) {

        const safeInt = (val, fallback) => {
            if (val === "" || val === null || val === undefined || val === "null" || val === "undefined") return fallback;
            const parsed = parseInt(val);
            return isNaN(parsed) ? fallback : parsed;
        };


        if(fromDate){
            fromDate = new Date(fromDate);
        }
        if(toDate){
            toDate = new Date(toDate);
        }

        

        const p = safeInt(page, 1);
        const l = safeInt(limit, 10);
        const s = (search === "" || search === null || search === undefined || search === "null") ? "" : search;
        const catId = (categoryId === "" || categoryId === null || categoryId === undefined || categoryId === "null") ? null : categoryId;
        const vId = (vendorId === "" || vendorId === null || vendorId === undefined || vendorId === "null") ? null : vendorId;

        const skip = Math.max(0, (p - 1) * l);
        const take = Math.max(1, l);

        const isValEmpty = (v) => v === "" || v === null || v === undefined || v === "null" || v === "undefined";
        
        const productActive = isValEmpty(isActive) ? null : (isActive === 'true' || isActive === true);
        const catActive = isValEmpty(categoryActive) ? null : (categoryActive === 'true' || categoryActive === true);


        const result = await this.productRepository.findAll(skip, take, s, catId, productActive, catActive, fromDate, toDate, vId);
        
        result.products = result.products.map(product => {
            const discountedProduct = this._applyDiscounts(product);
            return this._appendDeliveryInfo(discountedProduct, userLat, userLng);
        });
        
        return result;
    }

    async findById(id, userLat, userLng) {
        const product = await this.productRepository.findById(id);
        if (!product) return null;
        
        const discountedProduct = this._applyDiscounts(product);
        return this._appendDeliveryInfo(discountedProduct, userLat, userLng);
    }

    _appendDeliveryInfo(product, userLat, userLng) {
        let isDeliverable = true;
        let distanceKm = null;
        let vendorRadius = null;

        if (userLat !== undefined && userLng !== undefined && product.vendor) {
            const vLat = product.vendor.latitude;
            const vLng = product.vendor.longitude;
            const vRadius = product.vendor.deliveryRadius;

            if (vLat != null && vLng != null) {
                distanceKm = calculateHaversineDistance(vLat, vLng, parseFloat(userLat), parseFloat(userLng));
                if (distanceKm !== null && vRadius) {
                    vendorRadius = vRadius;
                    isDeliverable = distanceKm <= vRadius;
                }
            }
        }

        return {
            ...product,
            deliveryInfo: {
                isDeliverable,
                distanceKm: distanceKm !== null ? parseFloat(distanceKm.toFixed(2)) : null,
                vendorRadius
            }
        };
    }

    _applyDiscounts(product) {
        if (!product.variants || product.variants.length === 0) return product;

        const taxPercentage = product.taxPercentage || 0;
        const codExtraCharge = (product.codAllowed && product.codExtraCharge) ? product.codExtraCharge : 0;

        const activeOffer = product.offers && product.offers.length > 0 
            ? product.offers[0] 
            : null;

        const deal = (product.deals && product.deals.length > 0) ? product.deals[0] : null;

        product.variants = product.variants.map(variant => {
            const originalPrice = variant.price || 0;
            let currentPrice = originalPrice;
            let isDealApplied = false;

            if (deal) {
                if (deal.discountType === "PERCENTAGE") {
                    currentPrice = parseFloat((originalPrice * (1 - deal.discountValue / 100)).toFixed(2));
                } else {
                    currentPrice = Math.max(0, originalPrice - deal.discountValue);
                }
                isDealApplied = true;
            } else if (variant.discountedPrice !== null && variant.discountedPrice !== undefined && variant.discountedPrice > 0) {
                currentPrice = variant.discountedPrice;
            } else {
                const variantDiscountPercent = variant.discount || 0;
                const variantDiscountAmount = parseFloat((currentPrice * (variantDiscountPercent / 100)).toFixed(2));
                currentPrice = Math.max(0, currentPrice - variantDiscountAmount);
            }

            const baseDiscountedPrice = currentPrice;

           
            let offerDiscountAmount = 0;
            if (activeOffer && !isDealApplied) {
                if (activeOffer.discountType === "PERCENTAGE") {
                    offerDiscountAmount = parseFloat((currentPrice * (activeOffer.discountValue / 100)).toFixed(2));
                } else if (activeOffer.discountType === "FLAT") {
                    offerDiscountAmount = Math.min(currentPrice, activeOffer.discountValue);
                }
                currentPrice = Math.max(0, currentPrice - offerDiscountAmount);
            }

            const taxAmount = parseFloat((currentPrice * (taxPercentage / 100)).toFixed(2));
            const baseFinalPrice = parseFloat((currentPrice + taxAmount).toFixed(2));

            const finalPriceWithCOD = parseFloat((baseFinalPrice + codExtraCharge).toFixed(2));

            const variantDiscountAmount = parseFloat((originalPrice - baseDiscountedPrice).toFixed(2));

            return {
                ...variant,
                originalPrice,
                variantDiscountAmount,
                offerDiscountAmount,
                totalDiscountAmount: parseFloat((variantDiscountAmount + offerDiscountAmount).toFixed(2)),
                priceAfterDiscount: parseFloat(currentPrice.toFixed(2)),
                taxAmount,
                codExtraCharge: codExtraCharge,
                finalPrice: baseFinalPrice, 
                finalPriceWithCOD, 
                isDealOfTheDay: isDealApplied,
                dealInfo: isDealApplied ? {
                    id: deal.id,
                    discountType: deal.discountType,
                    discountValue: deal.discountValue,
                    date: deal.date,
                    startTime: deal.startTime,
                    endTime: deal.endTime
                } : null,
                activeOffer: (activeOffer && !isDealApplied) ? {
                    id: activeOffer.id,
                    title: activeOffer.title,
                    discountType: activeOffer.discountType,
                    discountValue: activeOffer.discountValue
                } : null
            };
        });

        product.totalStock = product.variants.reduce((sum, v) => sum + (v.stock || 0), 0);
        return product;
    }

    async update(id, data, files, adminId = null, req = null, requestVendorId = null) {
        const existing = await this.productRepository.findById(id);
        if (!existing) {
            const err = new Error("Product not found.");
            err.statusCode = 404;
            throw err;
        }

        if (requestVendorId && existing.vendorId !== requestVendorId) {
            const err = new Error("Forbidden. You can only update your own products.");
            err.statusCode = 403;
            throw err;
        }
        const payload = this._parsePayload(data);
        
        const filesByField = {};
        if (files && Array.isArray(files)) {
            files.forEach(file => {
                if (!filesByField[file.fieldname]) {
                    filesByField[file.fieldname] = [];
                }
                filesByField[file.fieldname].push(file.path);
            });
        }

        if (payload.variants && Array.isArray(payload.variants)) {
            const processedVariants = [];

            for (let i = 0; i < payload.variants.length; i++) {
                const v = payload.variants[i];
                
                const existingVariant = existing.variants.find(ev => (v.id && ev.id === v.id) || (v.sku && ev.sku === v.sku));
                
                let variantImages = [];
                if (v.images && Array.isArray(v.images)) {
                    variantImages = [...v.images];
                } else if (existingVariant && existingVariant.images) {
                    variantImages = existingVariant.images.map(img => img.imageUrl);
                }

                const fieldName = `variant_images_${i}`;
                if (filesByField[fieldName]) {
                    variantImages.push(...filesByField[fieldName]);
                }
                if (i === 0 && filesByField['images']) {
                    variantImages.push(...filesByField['images']);
                }

                const variantVideos = v.videos && Array.isArray(v.videos) ? [...v.videos] : (existingVariant && existingVariant.videos ? existingVariant.videos.map(v => v.videoUrl) : []);
                const videoFieldName = `variant_videos_${i}`;
                if (filesByField[videoFieldName]) {
                    variantVideos.push(...filesByField[videoFieldName]);
                }


                const variantData = {
                    sku: v.sku || (existingVariant ? existingVariant.sku : undefined),
                    costPrice: v.costPrice !== undefined ? parseFloat(v.costPrice) : (existingVariant ? existingVariant.costPrice : undefined),
                    price: v.price !== undefined ? parseFloat(v.price) : (existingVariant ? existingVariant.price : undefined),
                    discount: v.discount !== undefined ? parseFloat(v.discount) : (existingVariant ? existingVariant.discount : 0),
                    discountedPrice: v.discountedPrice !== undefined ? parseFloat(v.discountedPrice) : (existingVariant ? existingVariant.discountedPrice : undefined),
                    expiryDate: v.expiryDate ? new Date(v.expiryDate) : (existingVariant && existingVariant.expiryDate ? new Date(existingVariant.expiryDate) : undefined),
                    manufactureDate: v.manufactureDate ? new Date(v.manufactureDate) : (existingVariant && existingVariant.manufactureDate ? new Date(existingVariant.manufactureDate) : undefined),
                    stock: v.stock !== undefined ? parseInt(v.stock) : (existingVariant ? existingVariant.stock : 0),
                    isPrimary: v.isPrimary !== undefined ? v.isPrimary : (existingVariant ? existingVariant.isPrimary : false),
                    images: variantImages.length > 0 ? {
                        create: variantImages.map((img, idx) => ({
                            imageUrl: img,
                            isPrimary: idx === 0
                        }))
                    } : undefined,
                    videos: variantVideos.length > 0 ? {
                        create: variantVideos.map((video, idx) => ({
                            videoUrl: video,
                            isPrimary: idx === 0
                        }))
                    } : undefined
                };

                let variantSelections = [];
                if (v.selections && Array.isArray(v.selections)) {
                    variantSelections = await this._processSelections(v.selections);
                } else if (existingVariant && existingVariant.selections) {
                    variantSelections = existingVariant.selections.map(s => ({
                        variantNameId: s.variantNameId,
                        variantValueId: s.variantValueId
                    }));
                }

                if (variantSelections.length > 0) {
                    variantData.selections = {
                        create: variantSelections
                    };
                }

                processedVariants.push(variantData);
            }

         
            const incomingSkus = processedVariants.map(pv => pv.sku);

            await this.productRepository.db.productVariant.deleteMany({
                where: {
                    productId: id,
                    sku: { notIn: incomingSkus }
                }
            });

            await this.productRepository.db.productVariant.deleteMany({
                where: {
                    productId: id,
                    sku: { in: incomingSkus }
                }
            });

            payload.variants = {
                create: processedVariants
            };
        }

        const updated = await this.productRepository.update(id, payload);

        if (updated && this.adminAuditLogService) {
            await this.adminAuditLogService.log(
                adminId,
                "UPDATE",
                "Product",
                id,
                existing,
                updated,
                req
            );
        }

        return this._applyDiscounts(updated);
    }

    async toggleStatus(id, isActive, adminId = null, req = null, requestVendorId = null) {
        const existing = await this.productRepository.findById(id);
        if (!existing) {
            const err = new Error("Product not found.");
            err.statusCode = 404;
            throw err;
        }

        if (requestVendorId && existing.vendorId !== requestVendorId) {
            const err = new Error("Forbidden. You can only change status of your own products.");
            err.statusCode = 403;
            throw err;
        }

        const newStatus = isActive !== undefined ? (isActive === 'true' || isActive === true) : !existing.isActive;
        const updated = await this.productRepository.toggleStatus(id, newStatus);

        if (adminId && this.adminAuditLogService) {
            await this.adminAuditLogService.log(
                adminId,
                "TOGGLE_STATUS",
                "Product",
                id,
                { isActive: existing.isActive },
                { isActive: updated.isActive },
                req
            );
        }

        return {
            ...updated,
            message: newStatus ? "Product activated successfully." : "Product deactivated successfully."
        };
    }

    async getStats(vendorId = null) {
        return this.productRepository.getStats(vendorId);
    }

    async getExpiringProducts(days = 30, vendorId = null) {
        const d = parseInt(days) || 30;
        const products = await this.productRepository.findExpiringSoon(d, vendorId);
        return products.map(product => this._applyDiscounts(product));
    }

    
    async _processSelections(selections) {
        if (!Array.isArray(selections) || selections.length === 0) {
            return [];
        }

        const variantNameIds = [...new Set(selections.map((s) => s.variantNameId).filter(Boolean))];

        const validVariantNames = await this.productRepository.db.variantName.findMany({
            where: { id: { in: variantNameIds } },
            select: { id: true }
        });

        const validVariantNameIds = new Set(validVariantNames.map((v) => v.id));
        for (const variantNameId of variantNameIds) {
            if (!validVariantNameIds.has(variantNameId)) {
                const err = new Error(`Variant Type ID "${variantNameId}" does not exist. Please check your IDs.`);
                err.statusCode = 400;
                throw err;
            }
        }

        const existingValues = await this.productRepository.db.variantValue.findMany({
            where: { variantNameId: { in: variantNameIds } },
            select: { id: true, variantNameId: true, value: true, colorCode: true }
        });

        const valueCache = new Map();
        for (const value of existingValues) {
            const key = `${value.variantNameId}::${String(value.value).trim().toLowerCase()}`;
            valueCache.set(key, value);
        }

        const processed = [];
        for (const s of selections) {
            let finalValueId = s.variantValueId;

            if (!finalValueId && s.value) {
                const lookupKey = `${s.variantNameId}::${String(s.value).trim().toLowerCase()}`;
                const existing = valueCache.get(lookupKey);

                if (existing) {
                    finalValueId = existing.id;
                    if (s.colorCode && !existing.colorCode) {
                        const updated = await this.productRepository.db.variantValue.update({
                            where: { id: existing.id },
                            data: { colorCode: s.colorCode }
                        });
                        valueCache.set(lookupKey, {
                            ...existing,
                            colorCode: updated.colorCode
                        });
                    }
                } else {
                    const newValue = await this.productRepository.db.variantValue.create({
                        data: {
                            variantNameId: s.variantNameId,
                            value: s.value,
                            colorCode: s.colorCode || null
                        }
                    });
                    finalValueId = newValue.id;
                    valueCache.set(lookupKey, {
                        id: newValue.id,
                        variantNameId: s.variantNameId,
                        value: s.value,
                        colorCode: newValue.colorCode
                    });
                }
            }

            if (finalValueId) {
                processed.push({
                    variantNameId: s.variantNameId,
                    variantValueId: finalValueId
                });
            }
        }
        return processed;
    }
}

export default ProductService;
