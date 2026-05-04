#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🔔 Enabling email notifications...\n');

  const user = await prisma.user.update({
    where: { email: 'chandanbasavaraj88@gmail.com' },
    data: {
      notificationPreferences: {
        emailEnabled: true,
        pushEnabled: false,
      },
    },
  });

  console.log('✅ Email notifications enabled for:', user.email);
  console.log('Preferences:', user.notificationPreferences);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
