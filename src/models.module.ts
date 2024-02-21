// database.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.model';
import { Account, AccountSchema } from './account.model';
import { Transaction, TransactionSchema } from './transaction.model';
import config from './config'
@Module({
  imports: [
    MongooseModule.forRoot(config.),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Account.name, schema: AccountSchema },
      { name: Transaction.name, schema: TransactionSchema }
    ])
  ],
  exports: [MongooseModule]
})
export class DatabaseModule {}

// app.module.ts
// import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { DatabaseModule } from './database.module';

// @Module({
//   imports: [DatabaseModule],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}