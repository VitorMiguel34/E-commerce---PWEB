import 'dotenv/config'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '@prisma/client';

const URL = process.env.DATABASE_URL!.replace("file:","")

const adapter = new PrismaBetterSqlite3({ url: URL });
const prisma = new PrismaClient({ adapter });

export default prisma;