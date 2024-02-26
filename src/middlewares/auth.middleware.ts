/**
 * @fileoverview This module provides a middleware service for authentication.
 * @module AuthMiddleware
 * @requires {@link https://www.npmjs.com/package/@nestjs/common @nestjs/common}
 * @requires {@link https://www.npmjs.com/package/express express}
 * @requires {@link https://www.npmjs.com/package/@nestjs/mongoose @nestjs/mongoose}
 * @requires {@link https://www.npmjs.com/package/mongoose mongoose}
 * @requires ../models/user.model
 * @requires ./sentry.middleware
 */
import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserDocumentWithFunc } from '../models/user.model';
import SentryService from './sentry.middleware';
/**
 * @class
 * @classdesc This class provides a middleware service for authentication.
 * @implements {NestMiddleware}
 */
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject(SentryService) private readonly sentryService: SentryService,
  ) {}
  /**
   * Middleware function for authentication.
   * @method
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @param {NextFunction} next - The next middleware function.
   * @returns {Promise<void>}
   */
  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];
    const user = (await this.userModel.findOne({
      tokens: { $elemMatch: { token } },
    })) as UserDocumentWithFunc;

    if (!user) {
      return res
        .status(401)
        .json({ message: 'Unauthorized, session may have expired' });
    }

    process.owner = {
      id: user && user._id,
      username: user && user.username,
      role: user && user.role,
      token: token,
    };
    this.sentryService.setUser(process.owner);
    process.Sentry && process.Sentry.setUser(process.owner);
    next();
  }
}
