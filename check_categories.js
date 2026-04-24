import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function checkCategories() {
  try {
    const categories = await prisma.category.findMany({
      where: { level: "TITLE", isActive: true },
      take: 20
    })
    console.log('--- TITLE CATEGORIES DEBUG ---')
    categories.forEach(c => {
      console.log(`ID: ${c.id}, Name: ${c.name}, Image: ${c.image}`)
    })
    console.log('------------------------------')
  } catch (err) {
    console.error(err)
  } finally {
    await prisma.$disconnect()
  }
}

checkCategories()
