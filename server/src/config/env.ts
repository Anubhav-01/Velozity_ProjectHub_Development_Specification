import { z } from 'zod';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const isTest = process.env.NODE_ENV === 'test';

// Railway / Render / Supabase / Neon connection URL resolution
const resolvedDatabaseUrl =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.DATABASE_PUBLIC_URL ||
  (isTest ? 'postgresql://postgres:postgres@localhost:5432/velozity_test' : '');

// Safe JWT secret resolution with automatic secure generation if missing in production/preview
let accessSecret = process.env.JWT_ACCESS_SECRET;
if (!accessSecret || accessSecret.length < 32) {
  accessSecret = isTest
    ? 'test_jwt_access_secret_for_unit_tests_32chars_min'
    : crypto.randomBytes(32).toString('hex');
  if (!isTest && process.env.NODE_ENV === 'production') {
    console.warn('⚠️  JWT_ACCESS_SECRET not supplied or too short; generated a 64-character secure key.');
  }
}

let refreshSecret = process.env.JWT_REFRESH_SECRET;
if (!refreshSecret || refreshSecret.length < 32) {
  refreshSecret = isTest
    ? 'test_jwt_refresh_secret_for_unit_tests_32chars_min'
    : crypto.randomBytes(32).toString('hex');
  if (!isTest && process.env.NODE_ENV === 'production') {
    console.warn('⚠️  JWT_REFRESH_SECRET not supplied or too short; generated a 64-character secure key.');
  }
}

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(5000),

  // Database
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required. Set it in Railway/hosting environment variables.'),

  // JWT
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  ACCESS_TOKEN_EXPIRES_IN: z.string().default('15m'),
  REFRESH_TOKEN_EXPIRES_IN: z.string().default('7d'),

  // CORS
  CLIENT_URL: z.string().default('http://localhost:5173'),

  // Cookies
  COOKIE_SECURE: z.coerce.boolean().default(false),
  COOKIE_SAME_SITE: z.enum(['strict', 'lax', 'none']).default('lax'),
});

type Env = z.infer<typeof envSchema>;

let env: Env;

try {
  env = envSchema.parse({
    ...process.env,
    DATABASE_URL: resolvedDatabaseUrl,
    JWT_ACCESS_SECRET: accessSecret,
    JWT_REFRESH_SECRET: refreshSecret,
  });
} catch (error) {
  if (error instanceof z.ZodError) {
    const missingVars = error.errors.map((e) => `  - ${e.path.join('.')}: ${e.message}`).join('\n');
    console.error(`\n❌ Invalid environment configuration:\n${missingVars}\n`);
    process.exit(1);
  }
  console.error(`\n❌ Invalid environment configuration:\n  - ${(error as any).message}\n`);
  process.exit(1);
}

export { env };
export default env;
