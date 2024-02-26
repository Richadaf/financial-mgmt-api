/**
 * @fileoverview This service provides Mongoose options and connection management functionality.
 * @requires {@link https://www.npmjs.com/package/@nestjs/common @nestjs/common}
 * @requires {@link https://www.npmjs.com/package/@nestjs/mongoose @nestjs/mongoose}
 * @requires ../../../config/index
 * @requires {@link https://www.npmjs.com/package/ora-classic ora-classic}
 */
import { Injectable } from '@nestjs/common';
import {
  MongooseOptionsFactory,
  MongooseModuleOptions,
} from '@nestjs/mongoose';
import config from '../../../config/index';
import ora from 'ora-classic';

/**
 * MongooseService class
 * @class
 * @public
 * @implements {MongooseOptionsFactory}
 */
@Injectable()
export class MongooseService implements MongooseOptionsFactory {
  /**
   * Ora spinner instance
   * @private
   * @type {ora.Ora}
   */
  private readonly mongoThrobber = ora();

  /**
   * Mongoose connection instance
   * @private
   */
  private connection;

  /**
   * Flag to control logging
   * @private
   * @type {boolean}
   */
  private showLogs: boolean = true;

  /**
   * Creates Mongoose options.
   * @public
   * @returns {MongooseModuleOptions} - The mongoose options
   */
  createMongooseOptions(): MongooseModuleOptions {
    const mongoURI =
      config.env === 'production'
        ? config.mongo.uri
        : config.env === 'staging'
          ? config.mongo.stagingURI
          : config.mongo.testURI;

    return {
      uri: mongoURI,
      connectionFactory: (connection) => {
        this.connection = connection;
        this.enableLogs();
        return connection;
      },
    };
  }

  /**
   * Enables logging.
   * @public
   */
  enableLogs() {
    this.showLogs = true;
    // ... remaining implementation
  }

  /**
   * Disables logging.
   * @public
   */
  disableLogs() {
    this.showLogs = false;
    // ... remaining implementation
  }

  /**
   * Disconnects from MongoDB.
   * @public
   * @param {string} message - The message to log before disconnecting
   * @returns {Promise<void>} - A promise that resolves when the connection is closed
   */
  async disconnect(message) {
    if (this.connection) {
      this.showLogs ? this.mongoThrobber.info(message) : null;
      return await this.connection.close();
    }
  }
}
