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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        CLIENT_ID: Joi.string().required(),
        CLIENT_SECRET_KEY: Joi.string().required(),
      }),
    }),
    PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.register({
      secret:'gistalk2023',
      signOptions:{
        expiresIn: '3h',// '10y'
      }
    })
    ,HttpModule, TypeOrmModule.forFeature([User])],
  providers: [UserService, ConfigService],
  controllers: [UserController]
})
export class UserModule {}
