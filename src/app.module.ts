import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from './features/user/user.module';
import { AuthModule } from './features/auth/auth.module';
import { CustomersModule } from './features/customers/customers.module';
import { AccountModule } from './features/account/account.module';
import { TransactionsModule } from './features/transactions/transactions.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db-gestioNet.sqlite',
      synchronize: true,
      autoLoadEntities: true,
    }),
    UserModule,
    AuthModule,
    CustomersModule,
    AccountModule,
    TransactionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
