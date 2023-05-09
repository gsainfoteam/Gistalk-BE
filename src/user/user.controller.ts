import { Body, Controller, Get, Post, Req, SetMetadata, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { LoginUserDto } from './dto/login-user.dto';
import { RolesGuard } from 'src/user_auth/role.guard';
import { Roles } from 'src/user_auth/decorator/role.decorator';
import { RoleType } from 'src/user_auth/role.type';

@Controller('user')
export class UserController {
    constructor(private readonly usersevice: UserService) {}

    @Get('/admin-role')
    @UseGuards(AuthGuard(), RolesGuard)
    @Roles('ROLE_ADMIN')
    adminRoleCheck(@Req() req): any {
        const user: any = req.user;
        return user
    }
    
    @Post("/join")
    LogIn(@Body() loginuserDto : LoginUserDto): Promise<{accessToken}> {
        return this.usersevice.LogIn(loginuserDto);//idp에서 발급받은 jwt token
    }

    @Get("/info")
    @UseGuards(AuthGuard())
    UserIonfo(@Req() req){
        return req.user
    }

    
}
