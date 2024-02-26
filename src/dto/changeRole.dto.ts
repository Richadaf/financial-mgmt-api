/**
 * @fileoverview This module provides a data transfer object for changing a user's role.
 * @module ChangeRoleDto
 * @requires {@link https://www.npmjs.com/package/class-validator class-validator}
 */

import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

/**
 * @class
 * @classdesc This class provides a data transfer object for changing a user's role.
 */
export default class ChangeRoleDto {
  /** The user's ID. */
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  readonly id?: string;
}
