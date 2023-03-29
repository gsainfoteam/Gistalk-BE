import { HttpService } from '@nestjs/axios';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
    constructor(private readonly httpService: HttpService,
        @InjectRepository(User)
        private userRepository : Repository<User>,
        private jwtService : JwtService,
        private configService : ConfigService
        ) {
    }

    /**idp로 부터 get 요청을 통해 유저의 로그인 여부를 확인합니다.
     * 확인되었다면 Gistalk용 jwtToken을 리턴합니다
    */
    async LogIn(jwt_token : string): Promise<any>//{accessToken}
    {
        // const token = JSON.stringify(jwt_token).split('"')[3];
        // console.log(typeof(token));

        // try{
        //     const ani = await this.httpService.axiosRef.get(
        //         'https://api.idp.gistory.me/idp/get_user_info',     
        //         {
        //             params : {
        //                 jwt_token : token,
        //                 client_id : this.configService.get('CLIENT_ID'),
        //                 client_secret_key : this.configService.get('CLIENT_SECRET_KEY')
                        
        //             }
        //         }
        //     );
        //     console.log(ani)
        //     const {user_uuid, user_email_id } = ani.data
            
        //     const found = this.userRepository.findOne({
        //         where : {
        //             email : user_email_id
        //         }
        //     })

        //     const payload = {user_email_id};
        //     const accessToken = await this.jwtService.sign(payload);
            
        //     if (found)
        //     {
        //         return {accessToken};
        //     }
        //     else{
        //         await this.userRepository
        //         .createQueryBuilder()
        //         .insert()
        //         .into(User)
        //         .values([
        //             { uuid : user_uuid, email : user_email_id},
        //         ])
        //         .execute()
                
        //         return {accessToken}; // gistalk을 위한 토큰
        //     }
            
        // } catch(err){
        //     console.log(err)
        //     throw new ConflictException('이미 등록된 유저입니다.')
        // }

        
    }  

}

