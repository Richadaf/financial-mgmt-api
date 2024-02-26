/**
 * @fileoverview This service provides logging functionality using the Loggly service via the winston library.
 * @requires {@link https://www.npmjs.com/package/@nestjs/common @nestjs/common}
 * @requires {@link https://www.npmjs.com/package/winston winston}
 * @requires {@link https://www.npmjs.com/package/winston-loggly-bulk winston-loggly-bulk}
 * @requires ../../config/index
 */
import { Injectable, LoggerService } from '@nestjs/common';
import winston from 'winston';
import { Loggly } from 'winston-loggly-bulk';
import config from '../../config/index';
/**
 * LogglyService class
 * @class
 * @public
 * @implements {LoggerService}
 */
@Injectable()
export class LogglyService implements LoggerService {
  /**
   * Winston instance with added Loggly transport
   * @private
   * @type {winston.Logger}
   */
  private winston = winston.add(
    new Loggly({
      token: config.loggly.token,
      subdomain: config.loggly.subdomain,
      tags: ['' + config.env],
      json: true,
    }),
  );

  /**
   * Logs an 'info' level message.
   * @public
   * @param {string} message - The message to log
   */
  log(message: string) {
    this.winston.log('info', message);
  }

  /**
   * Logs an 'error' level message with a trace.
   * @public
   * @param {string} message - The message to log
   * @param {string} trace - The trace to include with the log
   */
  error(message: string, trace: string) {
    this.winston.log('error', message, { trace });
  }

  /**
   * Logs a 'warn' level message.
   * @public
   * @param {string} message - The message to log
   */
  warn(message: string) {
    this.winston.log('warn', message);
  }

  /**
   * Logs a 'debug' level message.
   * @public
   * @param {string} message - The message to log
   */
  debug(message: string) {
    this.winston.log('debug', message);
  }

  /**
   * Logs a 'verbose' level message.
   * @public
   * @param {string} message - The message to log
   */
  verbose(message: string) {
    this.winston.log('verbose', message);
  }
}
