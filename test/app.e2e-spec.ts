/**
 * @file This file contains end-to-end tests for the Jekomo application. It includes tests for the user registration and login routes.
 * @requires {@link https://www.npmjs.com/package/@nestjs/testing @nestjs/testing}
 * @requires {@link https://www.npmjs.com/package/@nestjs/common @nestjs/common}
 * @requires {@link https://www.npmjs.com/package/supertest supertest}
 * @requires ../src/modules/core/nest.module
 */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Jekomo } from '../src/modules/core/nest.module';
/**
 * @function describe - Describes a suite of test cases
 * @param {string} - Name of the test suite
 * @callback - Function that implements the test suite
 */
describe('Jekomo (e2e)', () => {
  let app: INestApplication;
  /**
   * @function beforeEach - Function to be executed before each test case
   * @callback - Function that implements the setup
   */
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [Jekomo],
      providers: [],
    }).compile();

    app = moduleFixture.createNestApplication();
    // const server = app.getHttpServer();
    // console.log('server', server);
    // const router = server._events.request._router;

    // console.log('All registered routes:');
    // router.stack.forEach((layer: any) => {
    //   if (layer.route) {
    //     console.log(
    //       `${layer.route.stack[0].method.toUpperCase()} ${layer.route.path}`,
    //     );
    //   }
    // });
  });
  /**
   * @function afterAll - Function to be executed after all the test cases
   * @callback - Function that implements the teardown
   */
  afterAll((done) => {
    app.getHttpServer().close(done);
  });
  /**
   * @function it - Describes a test case
   * @param {string} - Name of the test case
   * @callback - Function that implements the test case
   */
  it('/users/register (POST)', async () => {
    const body = { username: 'e2e-test', password: 'e2e-test' };
    const response = await request(app.getHttpServer())
      .post('/v1/users/register')
      .send(body)
      .expect(200);
    expect(response.body).toHaveProperty('success');
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('username');
  });

  it('/users/login (POST)', async () => {
    const body = { username: 'e2e-test', password: 'e2e-test' };
    const response = await request(app.getHttpServer())
      .post('/v1/users/login')
      .send(body)
      .expect(200);
    expect(response.body).toHaveProperty('success');
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('username');
  });
});
