import { Request, Response, NextFunction } from 'express';
import { ResponseUtil } from '../../utils/response.util';

export class ErrorMiddleware {
  static handle(err: Error, req: Request, res: Response, next: NextFunction): void {
    console.error('Error caught by middleware:', err);
    
    ResponseUtil.serverError(res, 'An unexpected error occurred', err);
  }

  static notFound(req: Request, res: Response): void {
    ResponseUtil.notFound(res, `Route ${req.originalUrl} not found`);
  }
}