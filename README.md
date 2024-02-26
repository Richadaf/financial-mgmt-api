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

```bash
# auto-generate docs for the public. (This hides all internal apis and services)
$ yarn run docs
```
Now, you can host or open the html documentation at `./docs` directory.

## File Structure
```
.
├── LICENSE
├── README.md
├── dist
│   ├── config
│   │   ├── index.d.ts
│   │   ├── index.js
│   │   └── index.js.map
│   ├── controllers
│   │   ├── user.controller.d.ts
│   │   ├── user.controller.js
│   │   └── user.controller.js.map
│   ├── decorators
│   │   ├── roles.decorator.d.ts
│   │   ├── roles.decorator.js
│   │   └── roles.decorator.js.map
│   ├── dto
│   │   ├── login.dto.d.ts
│   │   ├── login.dto.js
│   │   ├── login.dto.js.map
│   │   ├── logout.dto.d.ts
│   │   ├── logout.dto.js
│   │   ├── logout.dto.js.map
│   │   ├── response.dto.d.ts
│   │   ├── response.dto.js
│   │   ├── response.dto.js.map
│   │   ├── user.dto.d.ts
│   │   ├── user.dto.js
│   │   └── user.dto.js.map
│   ├── enums
│   │   ├── userRoles.enum.d.ts
│   │   ├── userRoles.enum.js
│   │   └── userRoles.enum.js.map
│   ├── filters
│   │   ├── allExceptions.filter.d.ts
│   │   ├── allExceptions.filter.js
│   │   └── allExceptions.filter.js.map
│   ├── guards
│   │   ├── jwt-auth.guard.d.ts
│   │   ├── jwt-auth.guard.js
│   │   ├── jwt-auth.guard.js.map
│   │   ├── roles.guard.d.ts
│   │   ├── roles.guard.js
│   │   └── roles.guard.js.map
│   ├── interfaces
│   │   ├── express.interface.d.ts
│   │   ├── express.interface.js
│   │   └── express.interface.js.map
│   ├── jekomo.d.ts
│   ├── jekomo.js
│   ├── jekomo.js.map
│   ├── middlewares
│   │   ├── auth.middleware.d.ts
│   │   ├── auth.middleware.js
│   │   ├── auth.middleware.js.map
│   │   ├── sentry.middleware.d.ts
│   │   ├── sentry.middleware.js
│   │   └── sentry.middleware.js.map
│   ├── models
│   │   ├── account.model.d.ts
│   │   ├── account.model.js
│   │   ├── account.model.js.map
│   │   ├── transaction.model.d.ts
│   │   ├── transaction.model.js
│   │   ├── transaction.model.js.map
│   │   ├── user.model.d.ts
│   │   ├── user.model.js
│   │   └── user.model.js.map
│   ├── modules
│   │   ├── core
│   │   │   ├── nest.module.d.ts
│   │   │   ├── nest.module.js
│   │   │   └── nest.module.js.map
│   │   └── db
│   │       ├── database.module.d.ts
│   │       ├── database.module.js
│   │       └── database.module.js.map
│   ├── services
│   │   ├── core
│   │   │   └── db
│   │   │       ├── mongoose.service.d.ts
│   │   │       ├── mongoose.service.js
│   │   │       └── mongoose.service.js.map
│   │   ├── user.service.d.ts
│   │   ├── user.service.js
│   │   ├── user.service.js.map
│   │   └── utils
│   │       ├── loggly.service.d.ts
│   │       ├── loggly.service.js
│   │       └── loggly.service.js.map
│   ├── src
│   │   ├── config
│   │   │   ├── index.d.ts
│   │   │   ├── index.js
│   │   │   └── index.js.map
│   │   ├── controllers
│   │   │   ├── user.controller.d.ts
│   │   │   ├── user.controller.js
│   │   │   └── user.controller.js.map
│   │   ├── decorators
│   │   │   ├── roles.decorator.d.ts
│   │   │   ├── roles.decorator.js
│   │   │   └── roles.decorator.js.map
│   │   ├── dto
│   │   │   ├── changeRole.dto.d.ts
│   │   │   ├── changeRole.dto.js
│   │   │   ├── changeRole.dto.js.map
│   │   │   ├── login.dto.d.ts
│   │   │   ├── login.dto.js
│   │   │   ├── login.dto.js.map
│   │   │   ├── logout.dto.d.ts
│   │   │   ├── logout.dto.js
│   │   │   ├── logout.dto.js.map
│   │   │   ├── response.dto.d.ts
│   │   │   ├── response.dto.js
│   │   │   ├── response.dto.js.map
│   │   │   ├── token.dto.d.ts
│   │   │   ├── token.dto.js
│   │   │   ├── token.dto.js.map
│   │   │   ├── user.dto.d.ts
│   │   │   ├── user.dto.js
│   │   │   └── user.dto.js.map
│   │   ├── enums
│   │   │   ├── userRoles.enum.d.ts
│   │   │   ├── userRoles.enum.js
│   │   │   └── userRoles.enum.js.map
│   │   ├── filters
│   │   │   ├── allExceptions.filter.d.ts
│   │   │   ├── allExceptions.filter.js
│   │   │   └── allExceptions.filter.js.map
│   │   ├── guards
│   │   │   ├── jwt-auth.guard.d.ts
│   │   │   ├── jwt-auth.guard.js
│   │   │   ├── jwt-auth.guard.js.map
│   │   │   ├── roles.guard.d.ts
│   │   │   ├── roles.guard.js
│   │   │   └── roles.guard.js.map
│   │   ├── interfaces
│   │   │   ├── express.interface.d.ts
│   │   │   ├── express.interface.js
│   │   │   └── express.interface.js.map
│   │   ├── jekomo.d.ts
│   │   ├── jekomo.js
│   │   ├── jekomo.js.map
│   │   ├── middlewares
│   │   │   ├── auth.middleware.d.ts
│   │   │   ├── auth.middleware.js
│   │   │   ├── auth.middleware.js.map
│   │   │   ├── sentry.middleware.d.ts
│   │   │   ├── sentry.middleware.js
│   │   │   └── sentry.middleware.js.map
│   │   ├── models
│   │   │   ├── account.model.d.ts
│   │   │   ├── account.model.js
│   │   │   ├── account.model.js.map
│   │   │   ├── transaction.model.d.ts
│   │   │   ├── transaction.model.js
│   │   │   ├── transaction.model.js.map
│   │   │   ├── user.model.d.ts
│   │   │   ├── user.model.js
│   │   │   └── user.model.js.map
│   │   ├── modules
│   │   │   ├── core
│   │   │   │   ├── nest.module.d.ts
│   │   │   │   ├── nest.module.js
│   │   │   │   └── nest.module.js.map
│   │   │   └── db
│   │   │       ├── database.module.d.ts
│   │   │       ├── database.module.js
│   │   │       └── database.module.js.map
│   │   ├── services
│   │   │   ├── core
│   │   │   │   └── db
│   │   │   │       ├── mongoose.service.d.ts
│   │   │   │       ├── mongoose.service.js
│   │   │   │       └── mongoose.service.js.map
│   │   │   ├── user.service.d.ts
│   │   │   ├── user.service.js
│   │   │   ├── user.service.js.map
│   │   │   └── utils
│   │   │       ├── loggly.service.d.ts
│   │   │       ├── loggly.service.js
│   │   │       └── loggly.service.js.map
│   │   ├── strategies
│   │   │   ├── jwt.strategy.d.ts
│   │   │   ├── jwt.strategy.js
│   │   │   └── jwt.strategy.js.map
│   │   └── tests
│   │       ├── user.controller.spec.d.ts
│   │       ├── user.controller.spec.js
│   │       └── user.controller.spec.js.map
│   ├── strategies
│   │   ├── jwt.strategy.d.ts
│   │   ├── jwt.strategy.js
│   │   └── jwt.strategy.js.map
│   ├── test
│   │   ├── app.e2e-spec.d.ts
│   │   ├── app.e2e-spec.js
│   │   └── app.e2e-spec.js.map
│   ├── tsconfig.build.tsbuildinfo
│   └── tsconfig.tsbuildinfo
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
│   │   └── userRoles.enum.ts
│   ├── filters
│   │   └── allExceptions.filter.ts
│   ├── guards
│   │   ├── jwt-auth.guard.ts
│   │   └── roles.guard.ts
│   ├── interfaces
│   │   └── express.interface.ts
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
└── tsconfig.json
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
