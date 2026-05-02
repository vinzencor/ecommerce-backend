import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const deals = await prisma.dealOfTheDay.findMany({
    include: {
      product: true
    }
  });
  console.log('ALL DEALS:', JSON.stringify(deals, null, 2));
  
  const now = new Date();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);
  
  console.log('NOW:', now.toISOString());
  console.log('TODAY START:', todayStart.toISOString());
  console.log('TODAY END:', todayEnd.toISOString());
  
  const activeToday = await prisma.dealOfTheDay.findMany({
    where: {
      isActive: true,
      date: {
        gte: todayStart,
        lte: todayEnd
      }
    }
  });
  console.log('ACTIVE TODAY:', JSON.stringify(activeToday, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
