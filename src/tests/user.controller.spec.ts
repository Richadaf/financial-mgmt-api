/**
 * @file This file contains tests for the user controller. It includes tests for all the methods in the user controller including signup, login, logout, logoutAll, grantAdmin, and revokeAdmin.
 * @requires {@link https://www.npmjs.com/package/@nestjs/testing @nestjs/testing}
 * @requires {@link https://www.npmjs.com/package/@nestjs/mongoose @nestjs/mongoose}
 * @requires ../controllers/user.controller
 * @requires ../services/user.service
 * @requires ../models/user.model
 * @requires {@link https://www.npmjs.com/package/sinon sinon}
 * @requires ../dto/response.dto
 * @requires ../dto/user.dto
 * @requires {@link https://www.npmjs.com/package/@nestjs/common @nestjs/common}
 * @requires {@link https://www.npmjs.com/package/mongoose mongoose}
 * @requires ../services/utils/loggly.service
 * @requires ../middlewares/auth.middleware
 * @requires {@link https://www.npmjs.com/package/@nestjs/jwt @nestjs/jwt}
 * @requires ../middlewares/sentry.middleware
 * @requires ../modules/db/database.module
 * @requires ../config
 * @requires {@link https://www.npmjs.com/package/jest-mock-extended jest-mock-extended}
 * @requires {@link https://www.npmjs.com/package/jsonwebtoken jsonwebtoken}
 * @requires ../dto/logout.dto
 * @requires ../enums/userRoles.enum
 * @requires {@link https://www.npmjs.com/package/supertest supertest}
 * @requires ../dto/changeRole.dto
 * @requires ../dto/token.dto
 * @requires ../strategies/jwt.strategy
 * @requires ../dto/login.dto
 * @requires ../services/core/db/mongoose.service
 */

import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import UserController from '../controllers/user.controller';
import { UserService } from '../services/user.service';
import { User, UserDocument } from '../models/user.model';
import * as sinon from 'sinon';
import ResponseDto from '../dto/response.dto';
import UserDto from '../dto/user.dto';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Model, Query } from 'mongoose';
import { LogglyService } from '../services/utils/loggly.service';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { JwtModule, JwtService } from '@nestjs/jwt';
import SentryService from '../middlewares/sentry.middleware';
import { DatabaseModule } from '../modules/db/database.module';
import config from '../config';
import { mock } from 'jest-mock-extended';
import jwt from 'jsonwebtoken';
import LogoutDto from '../dto/logout.dto';
import { UserRoles } from '../enums/userRoles.enum';
import request from 'supertest';
import ChangeRoleDto from '../dto/changeRole.dto';
import TokenDto from '../dto/token.dto';
import { JwtStrategy } from '../strategies/jwt.strategy';
import LoginDto from '../dto/login.dto';
import { MongooseService } from '../services/core/db/mongoose.service';
const mockAuthMiddleware = mock<AuthMiddleware>();
const mockLogglyService = mock<LogglyService>();
const mockUserModel = mock<Model<UserDocument>>();
const mockSentryService = mock<SentryService>();
const mockJwtService = mock<JwtService>();
/**
 * @function describe - Describes a suite of test cases
 * @param {string} - Name of the test suite
 * @callback - Function that implements the test suite
 */
describe('UserController', () => {
  let app: INestApplication;
  let userController: UserController;
  let userService: UserService;
  let sandbox;
  let server;
  let mongooseService: MongooseService;

  beforeEach(async () => {
    userService = new UserService(
      mockUserModel,
      mockLogglyService,
      mockAuthMiddleware,
      mockJwtService,
    );
    userController = new UserController(userService);
    const moduleRef = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        JwtModule.register({
          secret: config.secret,
        }),
      ],
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: LogglyService,
          useValue: mockLogglyService,
        },
        {
          provide: SentryService,
          useValue: mockSentryService,
        },
        AuthMiddleware,
        JwtStrategy,
        MongooseService,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    server = app.getHttpServer();
    userController = moduleRef.get<UserController>(UserController);
    userService = moduleRef.get<UserService>(UserService);
    mongooseService = moduleRef.get<MongooseService>(MongooseService);
    mongooseService.disableLogs();
    //Disconnect db for testing
    await mongooseService.disconnect(
      'Testing mode enabled: Disconnecting database',
    );
    const mockQuery = mock<Query<any, any>>();
    mockQuery.exec.mockResolvedValue({ username: 'test', password: 'test' });
    mockUserModel.findOne.mockReturnValue(mockQuery);
    mockUserModel.findById.mockReturnValue(mockQuery);

    sandbox = sinon.createSandbox();
  }, 30 * 1000); //Each has 30 seconds timeout

  afterEach(() => {
    sandbox.restore();
    server.close();
  });
  afterAll(async () => {
    await app.close();
  });
  /**
   * @function describe - Describes a suite of test cases
   * @param {string} - Name of the test suite
   * @callback - Function that implements the test suite
   */
  describe('register', () => {
    /**
     * @function it - Describes a test case
     * @param {string} - Name of the test case
     * @callback - Function that implements the test case
     */
    it('should return a response with data, success, and message', async () => {
      const mockUser = {
        username: 'test',
        password: 'test',
      };
      const mockResponse = {
        data: {
          username: 'test',
        },
        success: true,
        message: 'User created successfully',
      };
      const registerStub = sinon
        .stub(userService, 'register')
        .resolves(mockResponse.data);
      expect(await userController.register(mockUser)).toEqual(mockResponse);
      // verify that the service register method was called once with the mock user
      sinon.assert.calledOnceWithExactly(registerStub, mockUser);
    });

    it('should handle the service error and return a response with success false and message', async () => {
      const mockUser = {
        username: 'test',
        password: 'test',
      };
      const mockResponse = {
        success: false,
        message: 'Failed to create user',
      };
      const registerStub = sandbox.stub(userService, 'register').resolves(null);
      const { success, message } = await userController.register(mockUser);
      expect(success).toEqual(mockResponse.success);
      expect(message).toEqual(mockResponse.message);
      sinon.assert.calledOnceWithExactly(registerStub, mockUser);
    });

    it('should validate the user input and return a 400 error if invalid', async () => {
      const mockUser = {
        username: 'test',
        password: '', // invalid password
      };
      const validationPipe = new ValidationPipe();

      let error;
      try {
        await validationPipe.transform(mockUser, {
          type: 'body',
          metatype: UserDto,
        });
      } catch (e) {
        error = e;
      }
      expect(error.getResponse().message).toEqual([
        'password should not be empty',
      ]);
    });
  });
  describe('login', () => {
    it('should return a response with data, success, and message', async () => {
      const mockPayload = {
        username: 'test',
        password: 'test',
      };
      const mockResponse = {
        data: {
          user: {
            username: 'test',
            role: 'user',
          },
          token: expect.stringMatching(
            /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/,
          ), // use the regular expression to match the token
        },
        success: true,
        message: 'User logged in successfully',
      };

      const loginStub = sinon
        .stub(userService, 'login')
        .resolves(mockResponse.data);
      expect(await userController.login(mockPayload)).toEqual(mockResponse);
      sinon.assert.calledOnceWithExactly(loginStub, mockPayload);
    });

    it('should handle the service error and return a response with success false and message', async () => {
      const mockPayload = {
        username: 'test',
        password: 'testing1234',
      };
      const tkn = jwt.sign(mockPayload, config.secret);
      const mockResponse = {
        data: {
          user: {
            username: 'test',
            tokens: [{ token: tkn }],
          },
          token: tkn,
        },
        success: false,
        message: 'Login Failed',
      };
      const loginStub = sandbox.stub(userService, 'login').resolves(null);
      const { success, message } = await userController.login(mockPayload);
      expect(success).toEqual(mockResponse.success);
      expect(message).toEqual(mockResponse.message);
      sinon.assert.calledOnceWithExactly(loginStub, mockPayload);
    });

    it('should validate the user input and return a 400 error if invalid', async () => {
      const mockUser = {
        username: 'test',
        password: '', // invalid password
      };
      const validationPipe = new ValidationPipe();

      let error;
      try {
        await validationPipe.transform(mockUser, {
          type: 'body',
          metatype: LoginDto,
        });
      } catch (e) {
        error = e;
      }
      expect(error.getResponse().message).toEqual([
        'password should not be empty',
      ]);
    });
  });
  describe('logout', () => {
    it('should return a response with success and message', async () => {});

    it('should handle the service error and return a response with success false and message', async () => {
      const mockUser = { username: 'test', tokens: [], id: 'ogooogogo' };
      const mockToken = jwt.sign(mockUser, config.secret);
      mockUser.tokens.push({ token: mockToken });
      const mockResponse: ResponseDto<null> = {
        success: false,
        message: 'Logout Failed',
      };
      const logoutStub = sandbox.stub(userService, 'logout').resolves(null);
      const { success, message } = await userController.logout({
        id: mockUser.id,
        token: mockToken,
      });
      expect(success).toEqual(mockResponse.success);
      expect(message).toEqual(mockResponse.message);
      sinon.assert.calledOnceWithExactly(logoutStub, {
        id: mockUser.id,
        token: mockToken,
      });
    });

    it('should authenticate the request with the JWT token and return a 401 error if invalid', async () => {
      const mockUser: LogoutDto = { id: '507f1f77bcf86cd799439011' };
      (mockUser as any).token = 'token-that-should-throw-error';
      (mockUser as any).tokens = [{ token: mockUser.token }];
      (mockUser as any).role = UserRoles.USER;
      const mockResponse: ResponseDto<null> = {
        success: true,
        message: [
          'token must be a jwt string',
          'tokens.0.token must be a jwt string',
        ],
      };

      const validationPipe = new ValidationPipe();

      let error;
      try {
        await validationPipe.transform(mockUser, {
          type: 'body',
          metatype: LogoutDto,
        });
      } catch (e) {
        error = e;
      }
      expect(error.getResponse().message).toEqual(mockResponse.message);
    });
  });

  describe('logoutAll', () => {
    it('should return a response with success and message', async () => {
      const mockUser = { username: 'test', tokens: [], id: 'ogooogogo' };
      const mockToken = jwt.sign(mockUser, config.secret);
      mockUser.tokens.push({ token: mockToken });
      const mockResponse: ResponseDto<null> = {
        success: true,
        message: 'User logged out from all successfully',
      };

      const logoutAllStub = sandbox.stub(userService, 'logoutAll').resolves({
        n: 1,
        nModified: 1,
        ok: 1,
      });
      expect(await userController.logoutAll({ id: mockUser.id })).toEqual(
        mockResponse,
      );
      sinon.assert.calledOnceWithExactly(logoutAllStub, { id: mockUser.id });
    });

    it('should handle the service error and return a response with success false and message', async () => {
      const mockUser = { username: 'test', tokens: [], id: 'ogooogogo' };
      const mockToken = jwt.sign(mockUser, config.secret);
      mockUser.tokens.push({ token: mockToken });
      const mockResponse: ResponseDto<null> = {
        success: false,
        message: 'Logout Failed',
      };
      const logoutStub = sandbox.stub(userService, 'logoutAll').resolves(null);
      const { success, message } = await userController.logoutAll({
        id: mockUser.id,
      });
      expect(success).toEqual(mockResponse.success);
      expect(message).toEqual(mockResponse.message);
      sinon.assert.calledOnceWithExactly(logoutStub, { id: mockUser.id });
    });

    it('should authorize the request if user is ADMIN role', async () => {
      const mockUser: LogoutDto = {
        role: UserRoles.USER,
        tokens: [],
        id: '507f1f77bcf86cd799439011',
      };
      mockUser.token = jwt.sign(mockUser, config.secret);
      (mockUser.tokens as TokenDto[]).push({ token: mockUser.token });
      const mockResponse: ResponseDto<null> = {
        success: true,
        message: [],
      };
      const validationPipe = new ValidationPipe();
      let error;
      try {
        await validationPipe.transform(mockUser, {
          type: 'body',
          metatype: LogoutDto,
        });
      } catch (e) {
        error = e;
      }
      if (mockUser.role !== UserRoles.USER) {
        const logoutAllStub = sandbox.stub(userService, 'logoutAll').resolves({
          n: 1,
          nModified: 1,
          ok: 1,
        });
        const { success, message } = await userController.logoutAll({
          id: mockUser.id,
        });
        expect(success).toEqual(mockResponse.success);
        expect(message).toEqual('User logged out from all successfully');
        sinon.assert.calledOnceWithExactly(logoutAllStub, mockUser);
      } else {
        const logoutAllStub = sandbox
          .stub(userService, 'logoutAll')
          .resolves(null);
        const { success, message } = await userController.logoutAll({ id: '' });
        expect(success).toEqual(false);
        expect(message).toEqual('Logout Failed');
        sinon.assert.calledOnceWithExactly(logoutAllStub, { id: '' });
      }
      if (error) expect(error.getResponse().message).toEqual('Logout Failed');
    });

    it('should check the user role and return a 403 error if not admin', async () => {
      const mockUser: User = {
        _id: '507f1f77bcf86cd799439011',
        role: UserRoles.USER,
        username: 'tempU',
        password: 'oeginmieh',
        tokens: [],
      };
      const mockToken = jwt.sign(mockUser, config.secret);
      mockUser.tokens.push({ token: mockToken });
      await request(server)
        .post('/users/logoutAll')
        .set('Authorization', `Bearer ${mockToken}`)
        .send(mockUser)
        .expect(403);
    });

    describe('grantAdmin', () => {
      it('should return a response with success and message', async () => {
        const mockUser: ChangeRoleDto = { id: '507f1f77bcf86cd799439011' };
        const mockResponse: ResponseDto<null> = {
          success: true,
          message: 'User role switched to admin successfully',
        };
        const grantAdminStub = sandbox
          .stub(userService, 'grantAdmin')
          .resolves({
            n: 1,
            nModified: 1,
            ok: 1,
          });
        expect(await userController.grantAdmin({ id: mockUser.id })).toEqual(
          mockResponse,
        );
        sinon.assert.calledOnceWithExactly(grantAdminStub, { id: mockUser.id });
      });

      it('should handle the service error and return a response with success false and message', async () => {
        const mockUser: ChangeRoleDto = { id: '507f1f77bcf86cd799439011' };
        const mockResponse: ResponseDto<null> = {
          success: false,
          message: 'Failed to change role',
        };
        const grantAdminStub = sandbox
          .stub(userService, 'grantAdmin')
          .resolves(null);
        const { success, message } = await userController.grantAdmin({
          id: mockUser.id,
        });
        expect(success).toEqual(mockResponse.success);
        expect(message).toEqual(mockResponse.message);
        sinon.assert.calledOnceWithExactly(grantAdminStub, { id: mockUser.id });
      });

      it('should validate the user input and return a 400 error if invalid', async () => {
        const mockUser: ChangeRoleDto = {
          id: 'cccccdzszszrftdfgddrs',
        };
        const validationPipe = new ValidationPipe();
        let error;
        try {
          await validationPipe.transform(mockUser, {
            type: 'body',
            metatype: ChangeRoleDto,
          });
        } catch (e) {
          error = e;
        }
        expect(error.getResponse().message).toEqual([
          'id must be a mongodb id',
        ]);
      });
      it('should check the user role and return a 403 error if not user', async () => {
        const mockUser: User = {
          _id: '507f1f77bcf86cd799439011',
          role: UserRoles.USER,
          username: 'tempU',
          password: 'oeginmieh',
          tokens: [],
        };
        const mockToken = jwt.sign(mockUser, config.secret);
        mockUser.tokens.push({ token: mockToken });
        await request(server)
          .post('/users/grantAdmin')
          .set('Authorization', `Bearer ${mockToken}`)
          .send(mockUser)
          .expect(403);
      });
    });

    describe('revokeAdmin', () => {
      it('should return a response with success and message', async () => {
        const mockUser: ChangeRoleDto = { id: '507f1f77bcf86cd799439011' };
        const mockResponse: ResponseDto<null> = {
          success: true,
          message: 'User role switched to admin successfully',
        };
        const revokeAdminStub = sandbox.stub(userService, 'revokeAdmin').resolves({
          n: 1,
          nModified: 1,
          ok: 1,
        });
        expect(await userController.revokeAdmin({ id: mockUser.id })).toEqual(
          mockResponse,
        );
        sinon.assert.calledOnceWithExactly(revokeAdminStub, { id: mockUser.id });
      });

      it('should handle the service error and return a response with success false and message', async () => {
        const mockUser: ChangeRoleDto = { id: 's507f1f77bcf86cd799439011' };
        const mockResponse: ResponseDto<null> = {
          success: false,
          message: 'Failed to change role',
        };
        const revokeAdminStub = sandbox
          .stub(userService, 'revokeAdmin')
          .resolves(null);
        const { success, message } = await userController.revokeAdmin({
          id: mockUser.id,
        });
        expect(success).toEqual(mockResponse.success);
        expect(message).toEqual(mockResponse.message);
        sinon.assert.calledOnceWithExactly(revokeAdminStub, { id: mockUser.id });
      });

      it('should validate the user input and return a 400 error if invalid', async () => {
        const mockUser: ChangeRoleDto = {
          id: 'cccccdzszszrftdfgddrs',
        };
        const validationPipe = new ValidationPipe();
        let error;
        try {
          await validationPipe.transform(mockUser, {
            type: 'body',
            metatype: ChangeRoleDto,
          });
        } catch (e) {
          error = e;
        }
        expect(error.getResponse().message).toEqual([
          'id must be a mongodb id',
        ]);
      });

      it('should check the user role and return a 403 error if not admin', async () => {
        const mockUser = {
          _id: '507f1f77bcf86cd799439011',
          role: UserRoles.USER,
        };
        const mockToken = jwt.sign(mockUser, config.secret);
        await request(server)
          .post('/users/grantAdmin')
          .set('Authorization', `Bearer ${mockToken}`)
          .send(mockUser)
          .expect(403);
      });
    });
  });
});
