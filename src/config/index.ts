/**
 * @fileoverview This module provides configurations for the application.
 * @module config
 * @requires {@link https://www.npmjs.com/package/dotenv dotenv}
 */

import 'dotenv/config';
/**
 * @description The exported configuration object.
 */
export default {
  port: process.env.PORT,
  app: process.env.APP,
  env: process.env.NODE_ENV,
  secret: process.env.APP_SECRET || '',
  sentryToken: process.env.SENTRY_TOKEN,
  sentryID: process.env.SENTRY_ID,
  mongo: {
    uri: process.env.MONGO_URI,
    testURI: process.env.MONGO_TEST_URI,
    stagingURI: process.env.MONGO_STAGING_URI,
    db: process.env.MONGODB,
  },
  loggly: {
    token: process.env.LOGGLY_TOKEN,
    subdomain: process.env.LOGGLY_SUBDOMAIN,
  },
};
