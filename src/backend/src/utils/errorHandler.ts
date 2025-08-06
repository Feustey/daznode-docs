import { Request, Response, NextFunction } from 'express';
import { logger } from './logger';

export interface ApiError extends Error {
    statusCode?: number;
    code?: string;
}

export const errorHandler = (
    error: ApiError,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    logger.error('API Error:', {
        error: error.message,
        stack: error.stack,
        url: req.url,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('User-Agent')
    });

    // Default error
    let statusCode = error.statusCode || 500;
    let message = error.message || 'Internal Server Error';

    // Handle specific error types
    if (error.name === 'ValidationError') {
        statusCode = 400;
        message = 'Validation Error';
    } else if (error.name === 'UnauthorizedError') {
        statusCode = 401;
        message = 'Unauthorized';
    } else if (error.name === 'CastError') {
        statusCode = 400;
        message = 'Invalid ID format';
    }

    res.status(statusCode).json({
        error: {
            message,
            code: error.code || 'INTERNAL_ERROR',
            timestamp: new Date().toISOString(),
            path: req.path
        }
    });
};

export const notFound = (req: Request, res: Response): void => {
    res.status(404).json({
        error: {
            message: 'Resource not found',
            code: 'NOT_FOUND',
            timestamp: new Date().toISOString(),
            path: req.path
        }
    });
};