import {dbConfig} from "../../config/database.config";
import { Pool } from 'pg';

class Database {
    private static instance: Database;
    private pool: Pool;

    private constructor() {
        this.pool = new Pool(dbConfig);
        this.pool.on('connect', () => {
            console.log('Connected to PostgreSQL database');
        });
        this.pool.on('error', (err) => {
            console.error('Unexpected database error:', err);
            process.exit(-1);
        });
    }

    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    public getPool(): Pool {
        return this.pool;
    }

    public async query(text: string, params?: any[]) {
        const start = Date.now();
        try {
            const res = await this.pool.query(text, params);
            const duration = Date.now() - start;
            console.log('Executed query', { text, duration, rows: res.rowCount });
            return res;
        } catch (error) {
            console.error('Query error:', error);
            throw error;
        }
    }

    public async close(): Promise<void> {
        await this.pool.end();
        console.log('Database connection closed');
    }
}

export default Database;