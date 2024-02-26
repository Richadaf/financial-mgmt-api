/**
 * @fileoverview This module provides a roles guard.
 * @module RolesGuard
 * @requires {@link https://www.npmjs.com/package/@nestjs/common @nestjs/common}
 * @requires {@link https://www.npmjs.com/package/@nestjs/core @nestjs/core}
 */
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
/**
 * @class
 * @classdesc This class provides a roles guard.
 * @implements {CanActivate}
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  /**
   * Determines whether the current user can access a route based on their role.
   * @method
   * @param {ExecutionContext} context - The execution context.
   * @returns {boolean} - Returns true if the user can access the route, false otherwise.
   */
  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return roles.includes(user.role);
  }
}
