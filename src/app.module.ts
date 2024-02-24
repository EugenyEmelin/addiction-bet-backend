import { Module } from '@nestjs/common';
import { AuthModule } from './app/auth/auth.module';
import { TransactionsModule } from './app/transactions/transactions.module';
import { UsersModule } from './app/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    AuthModule,
    TransactionsModule,
    UsersModule,
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'sqlite',
        database: 'addiction-bet',
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
    }),
  ],
})
export class AppModule {}
