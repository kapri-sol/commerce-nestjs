import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '@src/entity/account.entity';
import { AccountController } from './account.controller';
import { AccountQueryRepository } from './account.query-repository';
import { AccountService } from './account.service';

@Module({
  imports: [TypeOrmModule.forFeature([Account])],
  controllers: [AccountController],
  providers: [AccountService, AccountQueryRepository],
  exports: [AccountQueryRepository, AccountService],
})
export class AccountModule {}
