import { HttpService } from '@nestjs/axios';
import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { PaylaodDto } from './dto/payload.dto';
import { AuthParse } from 'src/utils/utils';
import { AxiosError, AxiosResponse } from 'axios';
import { catchError, firstValueFrom, timestamp } from 'rxjs';

@Injectable()
export class UserService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /**idp로 부터 get 요청을 통해 유저의 로그인 여부를 확인합니다.
   * 확인되었다면 Gistalk용 jwtToken을 리턴합니다
   */
  async LogIn({ code, type }: LoginUserDto): Promise<any> {
    const curr = new Date();
    console.log(code);
    console.log(type);
    console.log(curr);
    const url = this.configService.get<string>('IDP_URL') + '/token';
    try {
      const accessTokeResponse = await firstValueFrom(
        this.httpService
          .post(
            url,
            {
              code: code,
              grant_type: 'authorization_code',
              redirect_uri:
                type == 'dev'
                  ? this.configService.get<string>('LOCAL_REDIRECT_URL')
                  : this.configService.get<string>('STG_REDIRECT_URL'),
            },
            {
              headers: { 'content-type': 'application/x-www-form-urlencoded' },
              auth: {
                username: this.configService.get<string>('CLIENT_ID'),
                password: this.configService.get<string>('CLIENT_SECRET_KEY'),
              },
            },
          )
          .pipe(
            catchError((err: AxiosError) => {
              if (err.response?.status === 400) {
                throw new UnauthorizedException('Invalid auth code');
              }
              throw new InternalServerErrorException('network error');
            }),
          ),
      );
      console.log(type);
      console.log(curr, accessTokeResponse.data);
      return accessTokeResponse.data;
    } catch (e) {
      console.log(e);
    }
    return 'Failed to idp call';
  }
}
