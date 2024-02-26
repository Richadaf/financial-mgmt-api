/**
 * @fileoverview This strategy provides JWT based authentication.
 * @requires {@link https://www.npmjs.com/package/@nestjs/common @nestjs/common}
 * @requires {@link https://www.npmjs.com/package/@nestjs/passport @nestjs/passport}
 * @requires {@link https://www.npmjs.com/package/passport-jwt passport-jwt}
 * @requires ../config/index
 * @requires ../services/user.service
 */

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import config from '../config/index';
import { UserService } from '../services/user.service';

//JWT strategy for authentication. We'd later have others for Github, Facebook, Google, e.t.c.

/**
 * @class JwtStrategy
 * @public
 * @extends PassportStrategy
 * @description This class provides a JWT strategy for user authentication.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  /**
   * @constructor
   * @param {UserService} userService - The user service.
   */
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.secret,
    });
  }

  /**
   * @public
   * @async
   * @param {any} payload - The JWT payload.
   * @returns {Promise<{id: string, username: string, role: string}>} - The user data.
   * @description This method validates the JWT payload and returns the user data.
   */
  async validate(payload: any) {
    const user = await this.userService.getById(payload._id);
    return {
      id: user._id,
      username: user.username,
      role: user.role,
    };
  }
}
