const { execSync } = require('child_process');

const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.DATABASE_PUBLIC_URL;

// If a remote or cloud PostgreSQL URL is provided, automatically push database schema
if (dbUrl && !dbUrl.includes('placeholder')) {
  console.log('🔄 PostgreSQL database detected. Synchronizing Prisma schema...');
  try {
    execSync('npx prisma db push --schema=prisma/schema.prisma --accept-data-loss', {
      stdio: 'inherit',
      timeout: 60000,
    });
    console.log('✅ PostgreSQL schema synchronized successfully.');
  } catch (err) {
    console.warn('⚠️ Could not automatically push prisma schema:', err.message);
  }
} else {
  console.log('ℹ️ Starting web server. Attach a PostgreSQL database on Railway to enable full data persistence.');
}

// Start HTTP & WebSocket server
require('../server/dist/server.js');
