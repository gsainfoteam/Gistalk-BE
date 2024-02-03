import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { HttpModule } from '@nestjs/axios';
import { User } from './entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    HttpModule,
    TypeOrmModule.forFeature([User]),
  ],
  providers: [UserService, JwtStrategy],
  controllers: [UserController],
  exports: [JwtStrategy, PassportModule],
})
export class UserModule {}
