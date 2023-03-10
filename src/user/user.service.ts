import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
    constructor(private readonly httpService: HttpService) {}

    /**idp로 부터 get 요청을 통해 유저의 로그인 여부를 확인합니다.*/
    async LogIn(jwt_token : string): Promise<any>
    {
        const token = JSON.stringify(jwt_token).split('"')[3];
        console.log(typeof(token));
        let data = 'api.idp.gistory.me/idp/get_user_info'

        const ani = await this.httpService.axiosRef.get(
            'https://api.idp.gistory.me/idp/get_user_info',     
            {
                params : {
                    jwt_token : token,
                    client_id : 'gistalk2023',
                    client_secret_key : 'secret_key in CLINET_SECRET_KEY ./env'
                }
            }
        );
        console.log(ani)
        return ani.data
    }  

}

