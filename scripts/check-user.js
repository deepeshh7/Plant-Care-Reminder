#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: 'chandanbasavaraj88@gmail.com' },
    include: {
      plants: {
        include: {
          careSchedules: true,
        },
      },
    },
  });

  console.log('User:', JSON.stringify(user, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
