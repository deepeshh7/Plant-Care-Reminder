#!/usr/bin/env node

/**
 * Development Cron Job Runner
 * Automatically checks for due tasks every 5 minutes in development
 */

const CRON_SECRET = process.env.CRON_SECRET || '2364dcfe0d4b2face937fe20a2c79d235795798d3b33431b6f28a399356db1b7';
const API_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';
const CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes

console.log('🌱 Plant Care - Development Cron Runner');
console.log('=====================================');
console.log(`Checking for due tasks every 5 minutes...`);
console.log(`API URL: ${API_URL}`);
console.log('Press Ctrl+C to stop\n');

async function checkTasks() {
  try {
    const response = await fetch(`${API_URL}/api/cron/check-tasks`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${CRON_SECRET}`,
      },
    });

    const data = await response.json();
    const timestamp = new Date().toLocaleTimeString();

    if (response.ok) {
      console.log(`[${timestamp}] ✅ Cron executed successfully`);
      console.log(`  - Processed: ${data.processedCount} schedule(s)`);
      console.log(`  - Notifications sent: ${data.notificationsSent}`);
      if (data.errors && data.errors.length > 0) {
        console.log(`  - Errors: ${data.errors.length}`);
        data.errors.forEach(err => console.log(`    ⚠️  ${err}`));
      }
    } else {
      console.log(`[${timestamp}] ❌ Cron failed:`, data.error);
      if (data.message) {
        console.log(`  - Details: ${data.message}`);
      }
    }
  } catch (error) {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] ❌ Error:`, error.message);
    console.log('  Make sure your dev server is running (npm/pnpm/bun dev)');
  }
  console.log(''); // Empty line for readability
}

// Run immediately on start
checkTasks();

// Then run every 5 minutes
setInterval(checkTasks, CHECK_INTERVAL);

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Stopping development cron runner...');
  process.exit(0);
});
