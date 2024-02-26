/**
 * @fileoverview This module provides a data transfer object for logging in a user.
 * @module LoginDto
 * @requires {@link https://www.npmjs.com/package/class-validator class-validator}
 */

import { IsNotEmpty, IsString } from 'class-validator';

/**
 * @class
 * @classdesc This class provides a data transfer object for logging in a user.
 */
export default class LoginDto {
  /** The user's username. */
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  /** The user's password. */
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
