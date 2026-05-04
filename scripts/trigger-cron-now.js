#!/usr/bin/env node

/**
 * Manually trigger the cron job immediately (for testing)
 */

const CRON_SECRET = process.env.CRON_SECRET || '2364dcfe0d4b2face937fe20a2c79d235795798d3b33431b6f28a399356db1b7';
const API_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';

console.log('🌱 Manually triggering cron job...\n');

async function triggerCron() {
  try {
    const response = await fetch(`${API_URL}/api/cron/check-tasks`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${CRON_SECRET}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Cron executed successfully\n');
      console.log(`📊 Results:`);
      console.log(`   - Processed: ${data.processedCount} schedule(s)`);
      console.log(`   - Notifications sent: ${data.notificationsSent}`);
      
      if (data.errors && data.errors.length > 0) {
        console.log(`\n⚠️  Errors (${data.errors.length}):`);
        data.errors.forEach(err => console.log(`   - ${err}`));
      }
      
      if (data.processedCount === 0) {
        console.log('\n💡 No overdue tasks found.');
        console.log('   To create test data, run: pnpm run test:cron');
      }
    } else {
      console.log('❌ Cron failed:', data.error);
      if (data.message) {
        console.log(`   Details: ${data.message}`);
      }
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
    console.log('\n💡 Make sure your dev server is running:');
    console.log('   pnpm run dev');
  }
}

triggerCron();
