import prisma from '../Src/Config/prismaClient.js';

console.log('Prisma Models:', Object.keys(prisma).filter(k => !k.startsWith('_') && !k.startsWith('$')));

process.exit(0);
