import { generateCustomId } from "../../Utils/generateCustomId.js";

class VendorRepository {
    constructor(prismaClient) {
        this.db = prismaClient;
    }


    async create(data, files) {
        const processedData = this._processVendorData(data, files);
        return await this.db.vendor.create({
            data: {
                ...processedData,
                customId: generateCustomId("VEN"),
            },
        });
    }

    async findAll({ skip, take, search, isApproved, isActive, isFavourite, fromDate, toDate }) {
        const where = {};
        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
                { BusinessName: { contains: search, mode: "insensitive" } },
                { customId: { contains: search, mode: "insensitive" } },
            ];
        }
        const VALID_APPROVAL_STATUSES = ["PENDING", "APPROVED", "REJECTED"];
        if (isApproved && VALID_APPROVAL_STATUSES.includes(isApproved)) {
            where.isApproved = isApproved;
        }
        if (typeof isActive !== "undefined") where.is_active = isActive;
        if (typeof isFavourite !== "undefined") where.isFavourite = isFavourite;
        
        if (fromDate || toDate) {
            where.createdAt = {};
            if (fromDate) where.createdAt.gte = new Date(fromDate);
            if (toDate) where.createdAt.lte = new Date(toDate);
        }
        const [vendors, total] = await Promise.all([
            this.db.vendor.findMany({
                where,
                skip,
                take,
                orderBy: { createdAt: "desc" },
            }),
            this.db.vendor.count({ where }),
        ]);

        return { vendors, total };
    }



    async getVendorStats() {
        const [totalVendors, approvedVendors, rejectedVendors, pendingVendors] = await Promise.all([
            this.db.vendor.count(),
            this.db.vendor.count({ where: { isApproved: "APPROVED" } }),
            this.db.vendor.count({ where: { isApproved: "REJECTED" } }),
            this.db.vendor.count({ where: { isApproved: "PENDING" } }),
        ]);

        return {
            totalVendors,
            approvedVendors,
            rejectedVendors,
            pendingVendors,
        };
    }

    async findById(id) {
        return await this.db.vendor.findUnique({ where: { id } });
    }

    async update(id, data, files) {
        const processedData = this._processVendorData(data, files);
        return await this.db.vendor.update({ where: { id }, data: processedData });
    }

    async findBySetupToken(token) {
        return await this.db.vendor.findFirst({
            where: {
                setupToken: token,
                setupTokenExpiry: { gte: new Date() }
            }
        });
    }

    async completeSetup(id, hashedPassword) {
        return await this.db.vendor.update({
            where: { id },
            data: {
                password: hashedPassword,
                setupToken: null,
                setupTokenExpiry: null,
                is_verified: true
            }
        });
    }

    _processVendorData(data, files) {
        const processed = { ...data };

        // Handle file uploads (compatible with both upload.any() and upload.fields())
        if (files) {
            const getFilePath = (fieldname) => {
                if (Array.isArray(files)) {
                    const file = files.find(f => f.fieldname === fieldname);
                    return file ? file.path : undefined;
                }
                return files[fieldname]?.[0]?.path;
            };

            const logoPath = getFilePath('BusinessLogo');
            if (logoPath) processed.BusinessLogo = logoPath;

            const proofPath = getFilePath('IdProof');
            if (proofPath) processed.IdProof = proofPath;

            const pancardPath = getFilePath('pancard');
            if (pancardPath) processed.pancard = pancardPath;
        }

        // Handle phone fields
        if (data.phone) {
            processed.phone = data.phone.trim();
        }
        if (data.alternativePhone) {
            processed.alternativePhone = data.alternativePhone.trim();
        }

        if (typeof data.is_active !== 'undefined') {
            processed.is_active = data.is_active === 'true' || data.is_active === true;
        }
        if (typeof data.is_verified !== 'undefined') {
            processed.is_verified = data.is_verified === 'true' || data.is_verified === true;
        }
        if (typeof data.isProfileComplete !== 'undefined') {
            processed.isProfileComplete = data.isProfileComplete === 'true' || data.isProfileComplete === true;
        }
        if (typeof data.isFavourite !== 'undefined') {
            processed.isFavourite = data.isFavourite === 'true' || data.isFavourite === true;
        }
        
        if (data.isApproved) {
            const valid = ['PENDING', 'APPROVED', 'REJECTED'];
            if (valid.includes(data.isApproved)) processed.isApproved = data.isApproved;
        }

        if (data.latitude !== undefined && data.latitude !== null && data.latitude !== "") {
            processed.latitude = parseFloat(data.latitude);
        }
        if (data.longitude !== undefined && data.longitude !== null && data.longitude !== "") {
            processed.longitude = parseFloat(data.longitude);
        }
        if (data.deliveryRadius !== undefined && data.deliveryRadius !== null && data.deliveryRadius !== "") {
            processed.deliveryRadius = parseFloat(data.deliveryRadius);
        }

        return processed;
    }
}

export default VendorRepository;
