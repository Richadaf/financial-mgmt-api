# Jekomo API
</br>

![IsMaintained](https://img.shields.io/badge/Maintained%3F-yes-green.svg)
![AMA](https://img.shields.io/badge/Ask%20me-anything-1abc9c.svg)
![StarMe](https://img.shields.io/github/stars/richadaf/financial-mgmt-api.svg)
![Follow](https://img.shields.io/github/followers/richadaf.svg?style=social&label=Follow&maxAge=2592000)
![IssuesFound](https://img.shields.io/github/issues/richadaf/financial-mgmt-api.svg)


## Description

Jekomo is a task that implements components of a financial system within a software development company.

Here's the full requirement I got for this project: [Requirements](https://github.com/Richadaf/financial-mgmt-api/blob/master/REQUIREMENTS.md)

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

As for the routes you can test, see [Routes](https://github.com/Richadaf/financial-mgmt-api/blob/master/ROUTES.md)

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

Check this [link](https://docs-jekomo.vercel.app)

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


[![Telegram](https://img.shields.io/badge/Telegram-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/richiedagenius)
[![Instagram](https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://instagram.com/richiedagenius)
[![Snapchat](https://img.shields.io/badge/Snapchat-FFFC00?style=for-the-badge&logo=snapchat&logoColor=white)](https://t.snapchat.com/KdJfMVSH)
[![Github](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://t.snapchat.com/KdJfMVSH)

## Technologies used

![NodeJs](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Typescript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Css3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-323330?style=for-the-badge&logo=Jest&logoColor=white)
![Testing](https://img.shields.io/badge/testing%20library-323330?style=for-the-badge&logo=testing-library&logoColor=red)
![Sinon](https://img.shields.io/badge/sinon.js-323330?style=for-the-badge&logo=sinon)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![VSCode](https://img.shields.io/badge/Visual_Studio_Code-0078D4?style=for-the-badge&logo=visual%20studio%20code&logoColor=white)
![Prettier](https://img.shields.io/badge/prettier-1A2C34?style=for-the-badge&logo=prettier&logoColor=F7BA3E)
![Git](https://img.shields.io/badge/GIT-E44C30?style=for-the-badge&logo=git&logoColor=white)


## License

Jekomo is [MIT licensed](LICENSE).
