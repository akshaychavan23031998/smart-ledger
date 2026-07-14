import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';

interface ExceptionResponseBody {
  error?: string;
  message?: string | string[];
}

interface ApiErrorResponse {
  statusCode: number;
  error: string;
  message: string | string[];
  path: string;
  timestamp: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const httpContext = host.switchToHttp();
    const response = httpContext.getResponse<Response>();
    const request = httpContext.getRequest<Request>();

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    response.status(statusCode).json(
      this.createResponse({
        statusCode,
        exceptionResponse,
        path: request.originalUrl,
      }),
    );
  }

  private createResponse({
    statusCode,
    exceptionResponse,
    path,
  }: {
    statusCode: number;
    exceptionResponse: string | object | null;
    path: string;
  }): ApiErrorResponse {
    if (typeof exceptionResponse === 'string') {
      return {
        statusCode,
        error: this.getStatusLabel(statusCode),
        message: exceptionResponse,
        path,
        timestamp: new Date().toISOString(),
      };
    }

    if (exceptionResponse && typeof exceptionResponse === 'object') {
      const body = exceptionResponse as ExceptionResponseBody;

      return {
        statusCode,
        error: body.error ?? this.getStatusLabel(statusCode),
        message: body.message ?? 'Request failed',
        path,
        timestamp: new Date().toISOString(),
      };
    }

    return {
      statusCode,
      error: 'Internal Server Error',
      message: 'An unexpected error occurred',
      path,
      timestamp: new Date().toISOString(),
    };
  }

  private getStatusLabel(statusCode: number): string {
    const statusLabel = HttpStatus[statusCode];

    return typeof statusLabel === 'string'
      ? statusLabel
          .split('_')
          .map(
            (word) =>
              word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
          )
          .join(' ')
      : 'Error';
  }
}
