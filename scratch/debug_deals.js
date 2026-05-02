import 'dotenv/config';
import prisma from '../Src/Config/prismaClient.js';

async function main() {
  console.log('--- START DEALS CHECK ---');
  const now = new Date();
  console.log('Current Time:', now.toISOString());

  try {
    const allDeals = await prisma.dealOfTheDay.findMany({
      include: { product: true }
    });
    console.log('Total deals in DB:', allDeals.length);
    allDeals.forEach(d => {
      console.log(`ID: ${d.id}, Active: ${d.isActive}, Date: ${d.date}, Start: ${d.startTime}, End: ${d.endTime}, Product: ${d.product?.productName}`);
    });

    const activeDeals = await prisma.dealOfTheDay.findMany({
      where: {
        isActive: true
      },
      include: { product: true }
    });
    console.log('Active deals (isActive=true):', activeDeals.length);

  } catch (err) {
    console.error('Error fetching deals:', err);
  } finally {
    await prisma.$disconnect();
  }
  console.log('--- END DEALS CHECK ---');
}

main();
