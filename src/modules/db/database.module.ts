/**
 * @file This file contains the DatabaseModule which sets up the connection to the database and defines the schema for the User, Account and Transaction models.
 * @requires {@link https://www.npmjs.com/package/@nestjs/common @nestjs/common}
 * @requires {@link https://www.npmjs.com/package/@nestjs/mongoose @nestjs/mongoose}
 * @requires ../../models/user.model
 * @requires ../../models/account.model
 * @requires ../../models/transaction.model
 * @requires ../../services/mongoose.service
 */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../models/user.model';
import { Account, AccountSchema } from '../../models/account.model';
import { Transaction, TransactionSchema } from '../../models/transaction.model';
import { MongooseService } from '../../services/core/db/mongoose.service';
/**
 * @module DatabaseModule - This module sets up the connection to the database and defines the schema for the User, Account and Transaction models.
 */
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useClass: MongooseService,
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Account.name, schema: AccountSchema },
      { name: Transaction.name, schema: TransactionSchema },
    ]),
  ],
  providers: [MongooseService],
  exports: [MongooseService, MongooseModule],
})
export class DatabaseModule {}
