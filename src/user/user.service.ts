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
import { catchError, firstValueFrom } from 'rxjs';

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
  async LogIn({ code, state }: LoginUserDto): Promise<any> {
    console.log('in login');
    console.log(code);
    const accessTokeResponse = await firstValueFrom(
      this.httpService
        .post(
          'https://api.idp.gistory.me/oauth/token',
          {
            code: code,
            grant_type: 'authorization_code',
            redirect_uri: 'http://localhost:3000/user/join',
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
            if (err.response?.status === 401) {
              throw new UnauthorizedException('Invalid auth code');
            }
            throw new InternalServerErrorException('network error');
          }),
        ),
    );

    return accessTokeResponse.data;
  }
}

// let { jwt_token, email, uuid } = Loginuserdto;
// let email_user
// let uuid_user
// try{
//     if( jwt_token && !email && !uuid ){
//         console.log('token in')
//         const obj_token = JSON.parse(`{"jwt_toke":"${jwt_token}"}`) // type err change string to obj
//         const token = JSON.stringify(obj_token).split('"')[3];
//         const ani = await this.httpService.axiosRef.get(
//             this.configService.get('IDP_URL'),
//             {
//                 params : {
//                     jwt_token : token,
//                     client_id : this.configService.get('CLIENT_ID'),
//                     client_secret_key : this.configService.get('CLIENT_SECRET_KEY')
//                 }
//             }
//         );
//         email_user = ani.data.user_email_id;
//         uuid_user = ani.data.user_uuid;
//     }
//     else if ( email && uuid && !jwt_token ){ // 개발용. 따로 복잡한 비밀번호 할당하면 쓸 순 있겠지만 어디까지나 user_role부여서 토큰으로 로그인해야함.
//         console.log('local in')
//         email_user = email
//         uuid_user = uuid
//     }
//     else {
//         throw new NotFoundException("잘못된 입력");
//     }

//     const user_found = await this.userRepository.find({
//         where : {
//             uuid : uuid_user,
//             email : email_user
//         }
//     })

//     if(!email_user || !uuid_user)
//     {
//         throw new NotFoundException
//     }

//     if(user_found.length > 0)
//     {
//         console.log("Welcome again!")
//         const payload : PaylaodDto = {
//             id : user_found[0].id,
//             uuid: uuid_user,
//             email : email_user,
//             authorities : AuthParse(user_found)
//         };
//         const accessToken = await this.jwtService.sign(payload)
//         return {accessToken};
//     }
//     else{
//         console.log("Welcome!")
//         await this.userRepository
//         .createQueryBuilder()
//         .insert()
//         .into(User)
//         .values([
//             { uuid : uuid_user, email : email_user },
//         ])
//         .execute()
//         let payload1 = {
//             uuid: uuid_user,
//             email : email_user,
//         };

//         const accessToken = await this.jwtService.sign(payload1)
//         return {accessToken}; // gistalk을 위한 토큰
//     }
// } catch(err){
//     console.log(err)
//     throw new ConflictException('잘못된 정보입니다.');
// }
