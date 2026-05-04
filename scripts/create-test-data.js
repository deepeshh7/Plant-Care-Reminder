#!/usr/bin/env node

/**
 * Create test data for cron job testing
 * Creates a user, plant, and an overdue care schedule
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Creating test data for cron job...\n');

  // Create test user
  const hashedPassword = await bcrypt.hash('test123', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'chandanbasavaraj88@gmail.com' },
    update: {},
    create: {
      email: 'chandanbasavaraj88@gmail.com',
      password: hashedPassword,
      name: 'Test User',
      notificationPreferences: {
        emailEnabled: true,
        pushEnabled: false,
      },
    },
  });

  console.log('✅ Created user:', user.email);

  // Create test plant
  const plant = await prisma.plant.create({
    data: {
      name: 'Test Monstera',
      species: 'Monstera Deliciosa',
      userId: user.id,
      location: 'Living Room',
    },
  });

  console.log('✅ Created plant:', plant.name);

  // Create overdue care schedule (due 2 minutes ago for quick testing)
  const now = new Date();
  const twoMinutesAgo = new Date(now.getTime() - 2 * 60 * 1000);
  
  // Format time as HH:MM
  const timeOfDay = twoMinutesAgo.toTimeString().slice(0, 5);
  
  const schedule = await prisma.careSchedule.create({
    data: {
      plantId: plant.id,
      taskType: 'WATERING',
      frequencyDays: 7,
      timeOfDay: timeOfDay,
      startDate: twoMinutesAgo,
      nextDueDate: twoMinutesAgo, // Overdue by 2 minutes!
      isActive: true,
    },
  });

  console.log('✅ Created overdue schedule:', {
    taskType: schedule.taskType,
    nextDueDate: schedule.nextDueDate.toLocaleString(),
    isOverdue: schedule.nextDueDate < new Date(),
  });

  console.log('\n🎉 Test data created successfully!');
  console.log('\n📋 Test Credentials:');
  console.log(`   Email: ${user.email}`);
  console.log(`   Password: test123`);
  console.log('\n🧪 Quick Test (Immediate):');
  console.log('   Run: pnpm run cron:now');
  console.log('   You should see: "Processed: 1 schedule(s), Notifications sent: 1"');
  console.log(`   Check email: ${user.email}`);
  console.log('\n🔄 Auto Test (Every 5 minutes):');
  console.log('   Run: pnpm run dev:cron');
  console.log('   Wait up to 5 minutes for automatic check');
  console.log('\n�  Frontend Test:');
  console.log('1. Login at http://localhost:3000');
  console.log('2. Go to Plants → Test Monstera');
  console.log('3. View the overdue schedule');
  console.log(`4. Schedule time: ${timeOfDay} (2 minutes ago)`);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
