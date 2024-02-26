/**
 * @fileoverview This module provides a data transfer object for a user's token.
 * @module TokenDto
 * @requires {@link https://www.npmjs.com/package/class-validator class-validator}
 */

import { IsString, IsJWT } from 'class-validator';

/**
 * @class
 * @classdesc This class provides a data transfer object for a user's token.
 */
export default class TokenDto {
  /** The user's JWT token. */
  @IsString()
  @IsJWT()
  public token: string;
}
