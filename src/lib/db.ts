import { neon } from '@neondatabase/serverless';
const databaseUrl = process.env.DATABASE_URL;

export const sql = neon(databaseUrl || 'postgresql://placeholder:5432/db');

if (!databaseUrl && process.env.NODE_ENV === 'production') {
  console.warn('⚠️ DATABASE_URL is not set in production!');
}

/**
 * SCHEMA DE LA BASE DE DONNÉES (À copier dans la console Neon)
 * 
 * -- Table des utilisateurs
 * CREATE TABLE IF NOT EXISTS users (
 *   id TEXT PRIMARY KEY,
 *   email TEXT UNIQUE,
 *   stripe_customer_id TEXT,
 *   is_premium BOOLEAN DEFAULT FALSE,
 *   daily_message_count INTEGER DEFAULT 0,
 *   last_message_date DATE DEFAULT CURRENT_DATE,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
 * );
 * 
 * -- Table des conversations
 * CREATE TABLE IF NOT EXISTS conversations (
 *   id TEXT PRIMARY KEY,
 *   user_id TEXT REFERENCES users(id),
 *   title TEXT,
 *   messages JSONB,
 *   agent TEXT DEFAULT 'general',
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
 * );
 */

export async function getUser(email: string) {
  const users = await sql`SELECT * FROM users WHERE email = ${email}`;
  return users[0];
}

export async function incrementUserUsage(email: string) {
  const today = new Date().toISOString().split('T')[0];
  await sql`
    UPDATE users 
    SET daily_message_count = CASE 
      WHEN last_message_date = ${today} THEN daily_message_count + 1 
      ELSE 1 
    END,
    last_message_date = ${today}
    WHERE email = ${email}
  `;
}
