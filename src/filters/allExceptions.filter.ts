/**
 * @fileoverview This module provides an exception filter that catches all exceptions.
 * @module AllExceptionsFilter
 * @requires {@link https://www.npmjs.com/package/@nestjs/common @nestjs/common}
 * @requires {@link https://www.npmjs.com/package/express express}
 * @requires ../middlewares/sentry.middleware
 * @requires ../config/index
 */
import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Inject,
  ForbiddenException,
} from '@nestjs/common';
import { Response } from 'express';
import SentryService from '../middlewares/sentry.middleware';
import config from '../config/index';
/**
 * @class
 * @classdesc This class provides an exception filter that catches all exceptions.
 * @implements {ExceptionFilter}
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    @Inject(SentryService) private readonly sentryService: SentryService,
  ) {}
  /**
   * Captures an exception and sends a response.
   * @method
   * @param {unknown} exception - The exception to be captured.
   * @param {ArgumentsHost} host - The arguments host.
   */
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    this.sentryService.captureException(exception);

    let message: string | object = 'Internal server error';

    if (exception instanceof HttpException) {
      const responseFromException = exception.getResponse();
      message =
        typeof responseFromException === 'string'
          ? responseFromException
          : responseFromException['message'];
    }

    response.status(status).json({
      success: false,
      message: message,
    });
    if (
      config.env !== 'production' &&
      !(exception instanceof ForbiddenException)
    )
      throw new Error(exception as string);
  }
}
