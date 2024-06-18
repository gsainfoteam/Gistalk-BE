import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-http-bearer';
import { UserService } from '../user.service';
import { IdpService } from 'src/idp/idp.service';
import { User } from '@prisma/client';
import { UserInfo } from 'src/idp/types/userInfo.type';

@Injectable()
export class IdPStrategy extends PassportStrategy(Strategy, 'idp') {
  constructor(
    private readonly userService: UserService,
    private readonly idpService: IdpService,
  ) {
    super();
  }

  async validate(token: string): Promise<{
    gistalk: User;
    idp: UserInfo;
    token: string;
  }> {
    const idp = await this.idpService.getUserInfo(token).catch(() => {
      throw new UnauthorizedException();
    });
    const gistalk = await this.userService
      .findUserOrCreate({
        uuid: idp.uuid,
        name: idp.name,
      })
      .catch(() => {
        throw new UnauthorizedException();
      });
    return { gistalk, idp, token };
  }
}
