import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { string } from "joi";
import { type } from "os";
import { Observable } from "rxjs";
import { User } from "src/user/entity/user.entity";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector,
        private readonly configService : ConfigService) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        try {
            const roles = this.reflector.get<string[]> ('roles', context.getHandler());

            const request = context.switchToHttp().getRequest();
            const user = request.user as User;
            const comp : string = JSON.parse(JSON.stringify(user.authorities))[0].name
            return user && user.authorities && comp.includes(this.configService.get('ROLE'));
        } catch (error) {
            throw new UnauthorizedException;
        }
        
    }
}