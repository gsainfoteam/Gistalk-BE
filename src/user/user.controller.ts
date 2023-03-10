import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly usersevice: UserService) {}

    @Post("/login")
    LogIn(@Body() jwt_token: string): Promise<string> {
        return this.usersevice.LogIn(jwt_token);
    }
}
