import "dotenv/config";
import bcrypt from "bcrypt";
import prismaPkg from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { generateCustomId } from "../Utils/generateCustomId.js";

const { PrismaClient } = prismaPkg;

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma  = new PrismaClient({ adapter });

async function seedTestUser() {
    const TEST_PHONE = "9999999999";
    const TEST_PASSWORD = "testpassword123";
    const SALT_ROUNDS = 10;

    console.log(`Checking for test user with phone ${TEST_PHONE}...`);

    const existing = await prisma.users.findUnique({
        where: { phone: TEST_PHONE },
    });

    if (existing) {
        console.log("Test user already exists. Updating password and verification status...");
        const hashedPassword = await bcrypt.hash(TEST_PASSWORD, SALT_ROUNDS);
        await prisma.users.update({
            where: { id: existing.id },
            data: {
                password: hashedPassword,
                is_verified: true,
                is_active: true
            }
        });
        console.log("Test user updated successfully!");
    } else {
        console.log("Creating new test user...");
        const hashedPassword = await bcrypt.hash(TEST_PASSWORD, SALT_ROUNDS);
        const newUser = await prisma.users.create({
            data: {
                name: "Test User",
                phone: TEST_PHONE,
                password: hashedPassword,
                is_verified: true,
                is_active: true,
                customId: generateCustomId("USR")
            },
        });
        console.log("Test user created successfully!");
        console.log(`ID: ${newUser.id}`);
    }

    console.log("-----------------------------------------");
    console.log(`Phone    : ${TEST_PHONE}`);
    console.log(`Password : ${TEST_PASSWORD}`);
    console.log("-----------------------------------------");
}

seedTestUser()
    .catch((err) => {
        console.error("Failed to seed test user:", err.message);
    })
    .finally(() => prisma.$disconnect());
