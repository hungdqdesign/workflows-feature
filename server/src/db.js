// Simple database client using postgres directly
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/workflow';

const sql = postgres(connectionString);

export { sql };
