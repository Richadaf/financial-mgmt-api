/**
 * @fileoverview This module provides a data transfer object for a user.
 * @module UserDto
 * @requires {@link https://www.npmjs.com/package/class-validator class-validator}
 */

import { IsString, IsNotEmpty } from 'class-validator';

/**
 * @class
 * @classdesc This class provides a data transfer object for a user.
 */
export default class UserDto {
  /** The user's username. */
  @IsNotEmpty()
  @IsString()
  username: string;

  /** The user's password. */
  @IsNotEmpty()
  @IsString()
  password: string;

  /** The user's tokens. */
  tokens?: { token: string }[];
}
