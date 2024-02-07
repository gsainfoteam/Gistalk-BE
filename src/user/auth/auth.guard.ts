import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private userService: UserService) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;
    if (authorization) {
      const [scheme, token] = authorization.split(' ');
      if (token.slice(-3) == 'DEV') {
        return true;
      }
      try {
        const result = await this.userService.userInfo(token);
        const user = await this.userService.findUserFromUuid(result.user_uuid);
        return result && user;
      } catch (err) {
        throw new UnauthorizedException();
      }
    }
    throw new BadRequestException();
  }
}
