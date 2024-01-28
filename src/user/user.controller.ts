import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiResponse, ApiTags, ApiOperation } from '@nestjs/swagger';
import { any } from 'joi';

@ApiTags('USERS')
@Controller('user')
export class UserController {
  constructor(private readonly usersevice: UserService) {}

  @Get('/join') // front-end set this path to redirect url /user/join
  LogIn(@Query() loginuserDto: LoginUserDto): Promise<{ accessToken }> {
    return this.usersevice.LogIn(loginuserDto); //idp에서 발급받은 jwt token
  }

  @Get('/info')
  @UseGuards(AuthGuard())
  UserIonfo(@Req() req) {
    return req.user;
  }
}
