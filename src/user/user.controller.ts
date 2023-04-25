import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('user')
export class UserController {
    constructor(private readonly usersevice: UserService) {}

    @Post("/join")
    LogIn(@Body() Loginuserdto : LoginUserDto): Promise<{accessToken}> {
        return this.usersevice.LogIn(Loginuserdto);//idp에서 발급받은 jwt token
    }

    @Post("/info")
    @UseGuards(AuthGuard())
    AuthTest(@Req() req){
        return req.user
    }
}
