import { Response } from 'express';

export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
}

export class ResponseUtil {
    static success<T>(res: Response, message: string, data?: T, statusCode: number = 200): Response {
        const response: ApiResponse<T> = {
            success: true,
            message,
            data
        };
        return res.status(statusCode).json(response);
    }

    static error(res: Response, message: string, statusCode: number = 500, data?: any): Response {
        const response: ApiResponse = {
            success: false,
            message,
            data
        };
        return res.status(statusCode).json(response);
    }

    static created<T>(res: Response, message: string, data?: T): Response {
        return this.success(res, message, data, 201);
    }

    static badRequest(res: Response, message: string, data?: any): Response {
        return this.error(res, message, 400, data);
    }

    static notFound(res: Response, message: string = 'Resource not found'): Response {
        return this.error(res, message, 404);
    }

    static unauthorized(res: Response, message: string = 'Unauthorized'): Response {
        return this.error(res, message, 401);
    }

    static serverError(res: Response, message: string = 'Internal server error', error?: any): Response {
        console.error('Server Error:', error);
        return this.error(res, message, 500, error?.message);
    }
}