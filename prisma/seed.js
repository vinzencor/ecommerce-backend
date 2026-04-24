
import "dotenv/config";
import bcrypt from "bcrypt";
import prismaPkg from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const { PrismaClient } = prismaPkg;

const ADMIN_NAME     = process.env.SEED_ADMIN_NAME     
const ADMIN_EMAIL    = process.env.SEED_ADMIN_EMAIL    ;
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD;
const SALT_ROUNDS    = 12;

if (!ADMIN_PASSWORD) {
    console.error("  SEED_ADMIN_PASSWORD env var is required. Set it in your .env file.");
    process.exit(1);
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma  = new PrismaClient({ adapter });

async function main() {
    console.log("  Seeding admin...\n");

    // Prevent duplicate seeding
    const existing = await prisma.admin.findUnique({
        where: { email: ADMIN_EMAIL },
    });

    if (existing) {
        console.log(`   Admin "${ADMIN_EMAIL}" already exists. Skipping.`);
        return;
    }

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, SALT_ROUNDS);

    const admin = await prisma.admin.create({
        data: {
            name:     ADMIN_NAME,
            email:    ADMIN_EMAIL,
            password: hashedPassword,
            role:     "admin",
        },
    });

    console.log("  Admin seeded successfully!");
    console.log("─────────────────────────────────────");
    console.log(`   Name  : ${admin.name}`);
    console.log(`   Email : ${admin.email}`);
    console.log(`   Role  : ${admin.role}`);
    console.log(`   ID    : ${admin.id}`);
    console.log("─────────────────────────────────────");
    console.log("   Keep SEED_ADMIN_PASSWORD safe. Never commit it to git.");
}

main()
    .catch((err) => {
        console.error("  Seeding failed:", err.message);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
