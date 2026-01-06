import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Database from './data/database/connection';
import { ErrorMiddleware } from './api/middleware/error.middleware';
import cartRoutes from "./api/routes/cart.routes";

dotenv.config();

class App {
    public app: Application;
    private port: number;

    constructor() {
        this.app = express();
        this.port = parseInt(process.env.PORT || '3000');
        this.initializeDatabase();
        this.initializeMiddlewares();
        this.initializeRoutes();
        this.initializeErrorHandling();
    }

    private initializeDatabase(): void {
        try {
            Database.getInstance();
            console.log('DB Ok initialized');
        } catch (error) {
            console.error('DB failed', error);
            process.exit(1);
        }
    }

    private initializeMiddlewares(): void {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));

        this.app.use((req, _res, next) => {
            console.log(`${req.method} ${req.path}`);
            next();
        });
    }

    private initializeErrorHandling(): void {
        this.app.use(ErrorMiddleware.notFound);
        this.app.use(ErrorMiddleware.handle);
    }

    private initializeRoutes(): void {

        this.app.use('/api/cart', cartRoutes);


    }

    public listen(): void {
        this.app.listen(this.port, () => {
            console.log(`Server port: http://localhost:${this.port}`);
        });
    }

    public async close(): Promise<void> {
        await Database.getInstance().close();
    }
}

const application = new App();
application.listen();

// Graceful shutdown
const shutdown = async () => {
    console.log('\n DB on');
    await application.close();
    process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

export default application;