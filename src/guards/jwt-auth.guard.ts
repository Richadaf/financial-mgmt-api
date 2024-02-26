/**
 * @fileoverview This module provides a guard for JWT authentication.
 * @module JwtAuthGuard
 * @requires {@link https://www.npmjs.com/package/@nestjs/common @nestjs/common}
 * @requires {@link https://www.npmjs.com/package/@nestjs/passport @nestjs/passport}
 */
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
/**
 * @class
 * @classdesc This class provides a guard for JWT authentication.
 * @extends {AuthGuard}
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
