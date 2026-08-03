import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgresql://postgres.chslfdzbiydrzuenwk:certiR_secure_pass_2026@aws-0-ap-south-1.pooler.supabase.com:6543/postgres',
  },
} satisfies Config;
