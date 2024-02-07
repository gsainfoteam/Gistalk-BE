import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  SetMetadata,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from './auth/auth.guard';

@ApiTags('USERS')
@Controller('user')
export class UserController {
  constructor(private readonly usersevice: UserService) {}

  @Get('/join') // front-end set this path to redirect url /user/join
  LogIn(@Query() loginuserDto: LoginUserDto): Promise<{ accessToken }> {
    return this.usersevice.LogIn(loginuserDto);
  }

  @UseGuards(AuthGuard)
  @Get('/info')
  UserIonfo(@Req() req) {
    return this.usersevice.userInfo(
      req.headers.authorization.split(' ').slice(-1)[0],
    );
  }

  @UseGuards(AuthGuard)
  @Get('/record')
  async UserRecord(@Req() req) {
    const user = await this.usersevice.userInfo(
      req.headers.authorization.split(' ').slice(-1)[0],
    );
    return await this.usersevice.userRecords(user.user_uuid);
  }
}

// kiYwNVkhJpKs641T1Pc7x0ESoLFmNzVEXMzrxvadvM
