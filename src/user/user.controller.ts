import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
    constructor(private readonly usersevice: UserService) {}

    @Post("/join")
    LogIn(@Body() jwt_token: string): Promise<{accessToken}> {
        return this.usersevice.LogIn(jwt_token);//idp에서 발급받은 jwt token
    }

    @Post("test")
    @UseGuards(AuthGuard())
    AuthTest(@Req() req){
        console.log(req.user)
    }
}
