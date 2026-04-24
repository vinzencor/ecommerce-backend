async function check() {
  const { PrismaClient } = await import('@prisma/client')
  const prisma = new PrismaClient()
  try {
    const cats = await prisma.category.findMany({ where: { level: 'TITLE' } })
    console.log(cats.map(c => ({ name: c.name, image: c.image })))
  } finally {
    await prisma.$disconnect()
  }
}
check()
