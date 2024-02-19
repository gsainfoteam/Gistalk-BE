import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { AxiosError, AxiosResponse } from 'axios';
import { catchError, firstValueFrom, timestamp } from 'rxjs';
import { userInfo } from 'os';
import { error } from 'console';

@Injectable()
export class UserService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private configService: ConfigService,
  ) {}

  /**idp로 부터 get 요청을 통해 유저의 로그인 여부를 확인합니다.
   * 확인되었다면 Gistalk용 jwtToken을 리턴합니다
   */
  async LogIn({ code, type }: LoginUserDto): Promise<any> {
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
      const user_info = await this.userInfo(
        accessTokeResponse.data.access_token,
      );
      const user = await this.findUserFromUuid(user_info.user_uuid);
      if (!user) {
        const user1 = new User();
        user1.uuid = user_info.user_uuid;
        await this.userRepository.save(user1);
      }
      return await accessTokeResponse.data;
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException('Invalid auth code');
    }
  }

  async userInfo(token: string): Promise<any> {
    const url = this.configService.get<string>('IDP_URL') + '/userinfo';
    const params = { access_token: token };

    const userInfoResponse = await firstValueFrom(
      this.httpService.get(url, { params }).pipe(
        catchError((err: AxiosError) => {
          if (err.response?.status === 401) {
            throw new UnauthorizedException('Invalid access');
          }
          throw new InternalServerErrorException('network error');
        }),
      ),
    );

    return userInfoResponse.data;
  }
  async findUserFromUuid(uuid: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: {
        uuid: uuid,
      },
    });
    return user;
  }

  async userRecords(uuid: string): Promise<any> {
    const result = await this.userRepository.findOne({
      relations: {
        records: {
          prof: true,
          lecture: true,
          semesters: true,
          years: true,
        },
      },
      where: {
        uuid: uuid,
      },
    });
    const obj_list = [];
    for (var i = 0; i < result.records.length; i++) {
      const parse: any = result.records[i];
      const obj = {
        record_id: parse.id,
        difficulty: parse.difficulty,
        strength: parse.strength,
        helpful: parse.helpful,
        interest: parse.interest,
        lots: parse.lots,
        satisfy: parse.satisfy,
        review: parse.review,
        recommend: parse.recommend,
        semester: parse.semesters.id,
        year: parse.years.year,
        prof_id: parse.prof.id,
        prof_name: parse.prof.prof_name,
        lecture_id: parse.lecture.id,
        lecture_code: parse.lecture.lecture_code,
        lecture_name: parse.lecture.lecture_name,
      };
      obj_list.push(obj);
    }

    return obj_list;
  }
}
