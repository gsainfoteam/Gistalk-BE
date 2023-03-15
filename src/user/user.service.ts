import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundError } from 'rxjs';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
    constructor(private readonly httpService: HttpService,
        @InjectRepository(User)
        private userRepository : Repository<User>
        ) {
    }

    /**idp로 부터 get 요청을 통해 유저의 로그인 여부를 확인합니다.*/
    async LogIn(jwt_token : string): Promise<any>
    {
        const token = JSON.stringify(jwt_token).split('"')[3];
        console.log(typeof(token));
        let data = 'api.idp.gistory.me/idp/get_user_info'

        try{
            const ani = await this.httpService.axiosRef.get(
                'https://api.idp.gistory.me/idp/get_user_info',     
                {
                    params : {
                        jwt_token : token,
                        client_id : 'gistalk2023',
                        client_secret_key : 'HDRbyP277JND7YbZCKINM92M3vi7BALx'
                    }
                }
            );
            
            return this.userRepository.manager.save(ani.data.user_uuid)//ani.data
        } catch(err){
            console.log(err)
            throw new NotFoundException('등록되지않은 유저입니다.');
        }

        
    }  

}

