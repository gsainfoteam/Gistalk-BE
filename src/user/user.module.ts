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
    PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.register({
      secret:'gistalk2023',
      signOptions:{
        expiresIn: '10y',// 나중에 프엔 개발용 토큰은 '10y'으로 발급합니다
      }
    })
    ,HttpModule, TypeOrmModule.forFeature([User])],
  providers: [UserService, JwtStrategy],
  controllers: [UserController],
  exports : [JwtStrategy, PassportModule]
})
export class UserModule {}
