import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function findLatest() {
  try {
    const user = await prisma.users.findFirst({
      orderBy: { createdAt: 'desc' }
    })
    console.log('--- LATEST USER DEBUG ---')
    console.log('Identifier:', user?.email || user?.phone)
    console.log('Name:', user?.name)
    console.log('OTP in DB:', user?.otp)
    console.log('OTP Type:', typeof user?.otp)
    console.log('Expires at:', user?.otp_expires_at)
    console.log('NOW:', new Date())
    console.log('-------------------------')
  } catch (err) {
    console.error(err)
  } finally {
    await prisma.$disconnect()
  }
}

findLatest()
