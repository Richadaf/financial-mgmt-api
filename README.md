<!-- Jekomo api -->

## Description

Jekomo is a task that implements components of a financial system within a software development company.

Here's the full requirement I got for this project: [Requirements](REQUIREMENTS)

## Installation

- Install `npm` or `yarn`
- Clone this repo
- Run `npm install` or `yarn` to install all dependencies.

```bash
$ yarn
```

- put the `.env` file you recieved in the root directory. and make sure it's named exactly `.env`

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

If you want to use a service like postman, here is the url you can call for this MVP.

`http://localhost:3000/v1/`

As for the routes you can test, see [Routes](ROUTES)

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Documentation

Check this [link](docs-jekomo.vercel.app)

### Build your own documentation instance

```bash
# auto-generate docs for the public. (This hides all internal apis and services)
$ yarn run docs
```

Now, you can host or open the html documentation at `./docs` directory.

## File Structure

```
.
├── DOCKERFILE
├── LICENSE
├── README.md
├── REQUIREMENTS.md
├── ROUTES.md
├── docs-theme.css
├── nest-cli.json
├── package.json
├── src
│   ├── config
│   │   └── index.ts
│   ├── controllers
│   │   └── user.controller.ts
│   ├── decorators
│   │   └── roles.decorator.ts
│   ├── dto
│   │   ├── changeRole.dto.ts
│   │   ├── login.dto.ts
│   │   ├── logout.dto.ts
│   │   ├── response.dto.ts
│   │   ├── token.dto.ts
│   │   └── user.dto.ts
│   ├── enums
│   │   ├── transactionTypes.enum.ts
│   │   └── userRoles.enum.ts
│   ├── filters
│   │   └── allExceptions.filter.ts
│   ├── guards
│   │   ├── jwt-auth.guard.ts
│   │   └── roles.guard.ts
│   ├── jekomo.ts
│   ├── middlewares
│   │   ├── auth.middleware.ts
│   │   └── sentry.middleware.ts
│   ├── models
│   │   ├── account.model.ts
│   │   ├── transaction.model.ts
│   │   └── user.model.ts
│   ├── modules
│   │   ├── core
│   │   │   └── nest.module.ts
│   │   └── db
│   │       └── database.module.ts
│   ├── services
│   │   ├── core
│   │   │   └── db
│   │   │       └── mongoose.service.ts
│   │   ├── user.service.ts
│   │   └── utils
│   │       └── loggly.service.ts
│   ├── strategies
│   │   └── jwt.strategy.ts
│   └── tests
│       └── user.controller.spec.ts
├── test
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── tsconfig.build.json
├── tsconfig.json
└── typedoc.json
```

As a contributor, the main files you will be working with are in `src`

## config

This folder contains all the environment variables.

## controllers

Contains all the controllers of all the routes.

## middlewares

Contains middlewares mounted on a route thats needs to be executed before the request reaches the intended route.

## models

All the mongoose schemas and models are defined here.

## services

Contains other services we put together mostly third-party libraries.

## Support

For enquires and questions, contact

- [@richadaf](https://github.com/richadaf)

## License

Jekomo is [MIT licensed](LICENSE).
