import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly usersevice: UserService) {}

  @Post('/join')
  LogIn(@Body() loginuserDto: LoginUserDto): Promise<{ accessToken }> {
    return this.usersevice.LogIn(loginuserDto); //idp에서 발급받은 jwt token
  }

  @Get('/info')
  @UseGuards(AuthGuard())
  UserIonfo(@Req() req) {
    return req.user;
  }
}
