/**
 * @fileoverview This module provides a data transfer object for logging out a user.
 * @module LogoutDto
 * @requires {@link https://www.npmjs.com/package/class-validator class-validator}
 * @requires {@link https://www.npmjs.com/package/class-transformer class-transformer}
 * @requires ./token.dto
 * @requires ../enums/userRoles.enum
 */

import {
  IsArray,
  ValidateNested,
  IsJWT,
  IsNotEmpty,
  IsString,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import TokenDto from './token.dto';
import { UserRoles } from '../enums/userRoles.enum';

/**
 * @class
 * @classdesc This class provides a data transfer object for logging out a user.
 */
export default class LogoutDto {
  /** The user's JWT token. */
  @IsString()
  @IsNotEmpty()
  @IsJWT()
  token?: string;

  /** The user's ID. */
  @IsString()
  @IsNotEmpty()
  id?: string;

  /** The user's role. */
  @IsEnum(UserRoles)
  role?: string;

  /** The user's tokens. */
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TokenDto)
  tokens?: TokenDto[];
}
