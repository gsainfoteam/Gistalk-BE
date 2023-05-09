import { Module } from '@nestjs/common';
import { UserAuthController } from './user_auth.controller';
import { UserAuthService } from './user_auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAuth } from './entity/user-auth.entity';

@Module({
  imports : [TypeOrmModule.forFeature([UserAuth])],
  controllers: [UserAuthController],
  providers: [UserAuthService]
})
export class UserAuthModule {}
