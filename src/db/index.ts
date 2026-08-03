import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres.uhvxsvvacrcyhskpmouc:supaSecretPass123!@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres';

// Disable prefetch as prepare: false is required for Supabase "Transaction" pool mode
const client = postgres(connectionString, { prepare: false, max: 10 });

export const db = drizzle(client, { schema });
export { schema };
