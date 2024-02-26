/**
 * @fileoverview This module provides a middleware service for Sentry, an error tracking tool.
 * @module SentryService
 * @requires {@link https://www.npmjs.com/package/@nestjs/common @nestjs/common}
 * @requires {@link https://www.npmjs.com/package/@nestjs/core @nestjs/core}
 * @requires {@link https://www.npmjs.com/package/express express}
 * @requires ../config/index
 * @requires {@link https://www.npmjs.com/package/@sentry/node @sentry/node}
 * @requires {@link https://www.npmjs.com/package/@sentry/profiling-node @sentry/profiling-node}
 */
import { Injectable, NestMiddleware } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Router } from 'express';
import config from '../config/index';
import * as SentryClient from '@sentry/node';
import { ProfilingIntegration } from '@sentry/profiling-node';
/**
 * @class
 * @classdesc This class provides a middleware service for Sentry.
 * @implements {NestMiddleware}
 */
@Injectable()
export default class SentryService implements NestMiddleware {
  private SentryClient: typeof SentryClient;

  constructor(private readonly adapterHost: HttpAdapterHost) {
    this.SentryClient = SentryClient;
  }

  //I made an init() because httpAdapter is not defined during
  // testing if it's in the constructor
  /**
   * Initializes Sentry client.
   * @method
   */
  init() {
    const app = this.adapterHost.httpAdapter.getInstance();
    this.SentryClient.init({
      dsn: `https://${config.sentryToken}@sentry.io/${config.sentryID}`,
      environment: config.env,
      integrations: [
        // enable HTTP calls tracing
        new this.SentryClient.Integrations.Http({ tracing: true }),
        // enable Express.js middleware tracing
        new this.SentryClient.Integrations.Express({ app: app as Router }),
        new ProfilingIntegration(),
      ],
      // Performance Monitoring
      tracesSampleRate: 1.0, //  Capture 100% of the transactions
      // Set sampling rate for profiling - this is relative to tracesSampleRate
      profilesSampleRate: 1.0,
    });
  }
  /**
   * Captures an exception in Sentry.
   * @method
   * @param {any} exception - The exception to be captured.
   */
  captureException(exception: any) {
    this.SentryClient.captureException(exception);
  }
  /**
   * Middleware function for Sentry request handler and error handler.
   * @method
   * @param {any} req - The request object.
   * @param {any} res - The response object.
   * @param {Function} next - The next middleware function.
   */
  use(req: any, res: any, next: () => void) {
    // The request handler must be the first middleware on the app
    this.SentryClient.Handlers.requestHandler()(req, res, (err) => {
      if (err) {
        // The error handler must be before any other error middleware
        this.SentryClient.Handlers.errorHandler()(err, req, res, (nextErr) => {
          // Custom error handler
          if (nextErr) {
            const eventId = this.SentryClient.captureException(nextErr);
            res.sentry = eventId;
            res.statusCode = 500;
            res.end(`${res.sentry}\n`);
          } else {
            next();
          }
        });
      } else {
        next();
      }
    });
  }
  /**
   * Sets user context in Sentry.
   * @method
   * @param {any} data - The user data.
   * @returns {void}
   */
  setUser(data: any) {
    return this.SentryClient.setUser(data);
  }
}
