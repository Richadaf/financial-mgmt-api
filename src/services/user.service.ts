/**
 * @fileoverview This service provides user management functionality.
 * @requires {@link https://www.npmjs.com/package/@nestjs/common @nestjs/common}
 * @requires ../middlewares/auth.middleware
 * @requires {@link https://www.npmjs.com/package/@nestjs/mongoose @nestjs/mongoose}
 * @requires {@link https://www.npmjs.com/package/mongoose mongoose}
 * @requires ./utils/loggly.service
 * @requires ../models/user.model
 * @requires ../dto/login.dto
 * @requires {@link https://www.npmjs.com/package/bcryptjs bcryptjs}
 * @requires {@link https://www.npmjs.com/package/@nestjs/jwt @nestjs/jwt}
 * @requires ../config/index
 * @requires ../dto/user.dto
 * @requires ../enums/userRoles.enum
 * @requires ../dto/logout.dto
 * @requires ../dto/changeRole.dto
 */
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { LogglyService } from './utils/loggly.service';
import {
  StrippedUser,
  TransformedUser,
  User,
  UserDocument,
  UserDocumentWithFunc,
} from '../models/user.model';
import LoginDto from '../dto/login.dto';
import bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import config from '../config/index';
import UserDto from '../dto/user.dto';
import { UserRoles } from '../enums/userRoles.enum';
import LogoutDto from '../dto/logout.dto';
import ChangeRoleDto from '../dto/changeRole.dto';

/**
 * @class UserService
 * @public
 * @description This class provides methods to manage users.
 */
@Injectable()
export class UserService {
  /**
   * @private
   * @type {LogglyService}
   * @description Loggly service for logging.
   */
  private readonly logger: LogglyService;
  /**
   * @constructor
   * @param {Model<UserDocument>} userModel - The user model.
   * @param {LogglyService} mLogger - The Loggly service.
   * @param {AuthMiddleware} authMiddleware - The authentication middleware.
   * @param {JwtService} jwtService - The JWT service.
   */
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly mLogger: LogglyService,
    private readonly authMiddleware: AuthMiddleware,
    private jwtService: JwtService,
  ) {
    this.logger = mLogger;
  }
  /**
   * @public
   * @async
   * @param {UserDto} user - The user data.
   * @returns {Promise<StrippedUser>} - The created user.
   * @throws {HttpException} - Throws an exception if the username already exists.
   */
  async register(user: UserDto): Promise<StrippedUser> {
    const existingUser = await this.userModel
      .findOne({ username: user.username })
      .exec();
    if (existingUser) {
      this.logger.warn(
        `Attempt to register with an existing username: ${user.username}`,
      );
      throw new HttpException(
        'Username already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    const createdUser = new this.userModel(user);
    const savedUser = await createdUser.save();

    this.logger.log(`User registered: ${savedUser.username}`);
    return (savedUser as any).strip();
  }

  /**
   * @public
   * @async
   * @param {LoginDto} payload - The login data.
   * @returns {Promise<{ user: TransformedUser; token: string }>} - The logged in user and the token.
   * @throws {Error} - Throws an error if the username or password is incorrect.
   */
  async login(
    payload: LoginDto,
  ): Promise<{ user: TransformedUser; token: string }> {
    const { username, password } = payload;
    const user = await this.userModel.findOne({ username }).exec();
    if (!user) {
      throw new Error('Invalid username or password');
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      throw new Error('Invalid username or password');
    }
    const token = await this.generateAuthToken(user);
    //I'm not logging the transform method because i don't want user tokens exposed in the logs
    this.logger.log(
      `${user.username}(${user.role}) logged in:` +
        JSON.stringify((user as UserDocumentWithFunc).strip()),
    );
    return { user: (user as UserDocumentWithFunc).transform(), token };
  }
  /**
   * @public
   * @async
   * @param {string} id - The user id.
   * @param {User} user - The user data.
   * @returns {Promise<User>} - The updated user.
   * @throws {NotFoundException} - Throws an exception if the user is not found.
   */
  async update(id: string, user: User): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(id, user, {
      new: true,
    });
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return updatedUser;
  }
  /**
   * @public
   * @async
   * @param {UserDocument} user - The user document.
   * @returns {Promise<string>} - The generated auth token.
   */
  async generateAuthToken(user: UserDocument): Promise<string> {
    const payload = { _id: user._id };
    const token = this.jwtService.sign(payload, { secret: config.secret });
    user.tokens = user.tokens.concat({ token });
    await this.userModel.updateOne({ _id: user._id }, user);
    return token;
  }
  /**
   * @public
   * @async
   * @param {LogoutDto} payload - The logout data.
   * @returns {Promise<mongoose.UpdateWriteOpResult>} - The result of the logout operation.
   */
  async logout(payload: LogoutDto): Promise<mongoose.UpdateWriteOpResult> {
    return await this.userModel.updateOne(
      { _id: process?.owner?.id || payload?.id },
      { $pull: { tokens: { token: process?.owner?.token || payload?.token } } },
    );
  }
  /**
   * @public
   * @async
   * @param {LogoutDto} payload - The logout data.
   * @returns {Promise<mongoose.UpdateWriteOpResult>} - The result of the logout all operation.
   */
  async logoutAll(payload: LogoutDto): Promise<mongoose.UpdateWriteOpResult> {
    return await this.userModel.updateOne(
      { _id: process?.owner?.id || payload.id },
      { $set: { tokens: [] } },
    );
  }
  /**
   * @public
   * @async
   * @param {string} id - The user id.
   * @returns {Promise<mongoose.HydratedDocument<User>>} - The user document.
   */
  async getById(id: string): Promise<mongoose.HydratedDocument<User>> {
    return await this.userModel.findById(id).exec();
  }
  /**
   * @public
   * @async
   * @param {ChangeRoleDto} payload - The change role data.
   * @returns {Promise<mongoose.UpdateWriteOpResult>} - The result of the grant admin operation.
   */
  async grantAdmin(
    payload: ChangeRoleDto,
  ): Promise<mongoose.UpdateWriteOpResult> {
    return await this.userModel.updateOne(
      { _id: process?.owner?.id || payload.id },
      { $set: { role: UserRoles.ADMIN } },
    );
  }
  /**
   * @public
   * @async
   * @param {ChangeRoleDto} payload - The change role data.
   * @returns {Promise<mongoose.UpdateWriteOpResult>} - The result of the grant user operation.
   */
  async revokeAdmin(
    payload: ChangeRoleDto,
  ): Promise<mongoose.UpdateWriteOpResult> {
    return await this.userModel.updateOne(
      { _id: process.owner.id || payload.id },
      { $set: { role: UserRoles.USER } },
    );
  }
}
