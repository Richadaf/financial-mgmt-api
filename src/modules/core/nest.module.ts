/**
 * @file This file contains the main module for the application (Jekomo) and the initialization function for the application.
 * @requires {@link https://www.npmjs.com/package/@nestjs/common @nestjs/common}
 * @requires ../../modules/db/database.module
 * @requires {@link https://www.npmjs.com/package/@nestjs/core @nestjs/core}
 * @requires {@link https://www.npmjs.com/package/@nestjs/platform-express @nestjs/platform-express}
 * @requires ora-classic
 * @requires ../../middlewares/sentry.middleware
 * @requires {@link https://www.npmjs.com/package/morgan morgan}
 * @requires {@link https://www.npmjs.com/package/body-parser body-parser}
 * @requires {@link https://www.npmjs.com/package/cookie-parser cookie-parser}
 * @requires ../../config/index
 * @requires ../../middlwares/auth.middleware
 * @requires ../../controllers/user.controller
 * @requires ../../services/user.service
 * @requires {@link https://www.npmjs.com/package/@nestjs/jwt @nestjs/jwt}
 * @requires ../../filters/allExceptions.filter
 * @requires ../../strategies/jwt.strategy
 */
import {
  NestModule,
  MiddlewareConsumer,
  Module,
  RequestMethod,
} from '@nestjs/common';
import { LogglyService } from '../../services/utils/loggly.service';
import { DatabaseModule } from '../../modules/db/database.module';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import ora from 'ora-classic';
import SentryMiddleware from '../../middlewares/sentry.middleware';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import config from '../../config/index';
import { AuthMiddleware } from '../../middlewares/auth.middleware';
import UserController from '../../controllers/user.controller';
import { UserService } from '../../services/user.service';
import { JwtModule } from '@nestjs/jwt';
import { AllExceptionsFilter } from '../../filters/allExceptions.filter';
import { JwtStrategy } from '../../strategies/jwt.strategy';

const protectedRoutes = [
  { path: 'users/logoutAll', method: RequestMethod.ALL },
  // { path: 'users/logout', method: RequestMethod.ALL },
  { path: 'users/grantAdmin', method: RequestMethod.ALL },
  { path: 'users/revokeAdmin', method: RequestMethod.ALL },
];
/**
 * @module Jekomo - This is the main module for the application. It sets up the necessary services, controllers and middleware.
 */
@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      secret: config.secret,
    }),
  ],
  controllers: [UserController],
  providers: [
    SentryMiddleware,
    LogglyService,
    AuthMiddleware,
    UserService,
    JwtStrategy,
    {
      provide: 'LoggerService',
      useClass: LogglyService,
    },
  ],
})
export class Jekomo implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(...protectedRoutes);
    consumer.apply(SentryMiddleware).forRoutes('*');
  }
}
/**
 * @function init - This function initializes the application. It sets up the necessary middleware, error handling, and starts the server.
 */
export async function init() {
  const appStartThrobber = ora();
  const app = await NestFactory.create<NestExpressApplication>(Jekomo);
  app.useLogger(app.get('LoggerService'));
  const server = app.getHttpServer();
  const allowedDevOrigins = [
    'http://localhost:3000',
    'https://dev.jekomo.com',
    'https://dev-api.jekomo.com',
  ];
  const allowedStagingOrigins = [
    'https://staging.jekomo.com',
    'https://staging-api.jekomo.com',
    'http://localhost:3000',
  ];
  app.use(morgan('dev'));

  app.useStaticAssets('public');

  app.use(bodyParser.json({ limit: '50mb' }));

  app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));

  app.use(cookieParser());

  if (config.env === 'dev' || config.env === 'sandbox') {
    // Add headers
    app.use((req: any, res: any, next: any) => {
      // Website you wish to allow to connect

      const { origin } = req.headers;

      if (origin && allowedDevOrigins.indexOf(origin) > -1) {
        res.setHeader('Access-Control-Allow-Origin', origin);
      }
      // Request methods you wish to allow
      res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, OPTIONS, PUT, PATCH, DELETE',
      );

      // Request headers you wish to allow
      res.setHeader(
        'Access-Control-Allow-Headers',
        'X-Requested-With,content-type,authorization',
      );

      // Set to true if you need the website to include cookies in the requests sent
      // to the API (e.g. in case you use sessions)
      res.setHeader('Access-Control-Allow-Credentials', 'true');

      // Pass to next layer of middleware
      next();
    });
  } else if (config.env === 'staging') {
    // Add headers
    app.use((req: any, res: any, next: any) => {
      // Website you wish to allow to connect

      const { origin } = req.headers;

      if (allowedStagingOrigins.indexOf(origin) > -1) {
        res.setHeader('Access-Control-Allow-Origin', origin);
      }
      // Request methods you wish to allow
      res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, OPTIONS, PUT, PATCH, DELETE',
      );

      // Request headers you wish to allow
      res.setHeader(
        'Access-Control-Allow-Headers',
        'X-Requested-With,content-type,authorization',
      );

      // Set to true if you need the website to include cookies in the requests sent
      // to the API (e.g. in case you use sessions)
      res.setHeader('Access-Control-Allow-Credentials', 'true');

      // Pass to next layer of middleware
      next();
    });
  } else if (config.env === 'production') {
    // Add headers
    app.use((req: any, res: any, next: any) => {
      // All webistes can connect
      res.setHeader('Access-Control-Allow-Origin', '*');
      // Request methods you wish to allow
      res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, OPTIONS, PUT, PATCH, DELETE',
      );

      // Request headers you wish to allow
      res.setHeader(
        'Access-Control-Allow-Headers',
        'X-Requested-With,content-type,authorization',
      );

      // Set to true if you need the website to include cookies in the requests sent
      // to the API (e.g. in case you use sessions)
      res.setHeader('Access-Control-Allow-Credentials', 'true');

      // Pass to next layer of middleware
      next();
    });
  }

  app.setGlobalPrefix('v1');
  const sentry = app.get(SentryMiddleware);
  sentry.init();
  app.useGlobalFilters(new AllExceptionsFilter(sentry));
  server.on('error', (err) => {
    appStartThrobber.fail(`Error : ${err}`);
    process.exit(-1);
  });

  app.listen(config.port, () => {
    appStartThrobber.succeed(
      `${config.app ? config.app.toUpperCase() + '-API' : 'APP'} Ready!`,
    );
  });
  return { app, server };
}
