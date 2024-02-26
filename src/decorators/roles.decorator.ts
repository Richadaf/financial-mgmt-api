/**
 * @fileoverview This module provides a decorator for setting user roles.
 * @module Roles
 * @requires {@link https://www.npmjs.com/package/@nestjs/common @nestjs/common}
 */

import { SetMetadata } from '@nestjs/common';

/**
 * @function
 * @description A decorator for setting user roles.
 * @param {...string[]} roles - The roles to be set.
 */
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
