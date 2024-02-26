/**
 * @fileoverview This module initializes the JEKOMO application and sets up global declarations for NodeJS Process.
 * @module jekomo
 * @requires ./.enmodules/core/nest.module
 * @requires {@link https://www.npmjs.com/package/@nestjs/node @sentry/node}
 */

import * as JEKOMO from './modules/core/nest.module';

/**
 * Global declaration for NodeJS Process.
 * @global
 * @typedef {Object} Process
 * @property {Object} Sentry - The Sentry module for error tracking.
 * @property {Object} owner - The object containing owner details.
 * @property {string|null} owner.id - The ID of the owner.
 * @property {string|null} owner.username - The username of the owner.
 * @property {string|null} owner.role - The role of the owner.
 * @property {string|null} owner.token - The token of the owner.
 */
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Process {
      Sentry: typeof import('@sentry/node') | null;
      owner: {
        id: string | null;
        username: string | null;
        role: string | null;
        token: string | null;
      } | null;
    }
  }
}

/**
 * The main function that initializes the JEKOMO application.
 * @async
 * @function
 * @throws {Error} Will throw an error if the initialization fails.
 */
async function main() {
  try {
    await JEKOMO.init();
  } catch (err) {
    console.log('ERROR', err);
    throw new Error(err);
  }
}

main();

/** @exports JEKOMO */
export default JEKOMO;
