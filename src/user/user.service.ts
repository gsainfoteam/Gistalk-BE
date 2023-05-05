import { HttpService } from '@nestjs/axios';
import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { LoginUserDto } from './dto/login-user.dto';

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
    async LogIn(Loginuserdto : LoginUserDto): Promise<{accessToken}>
    {
        let { jwt_token, role, email, uuid } = Loginuserdto;
        let user_email_id
        let user_uuid
        let accessToken
        try{
            if(role == 'admin' && email && uuid)
            {   
                user_email_id = email;
                user_uuid = uuid;
                const payload = {user_email_id, user_uuid};
                accessToken = await this.jwtService.sign(payload);
            }
            else if( jwt_token && !role && !email && !uuid ){
                const obj_token = JSON.parse(`{"jwt_toke":"${jwt_token}"}`) // type err change string to obj
                const token = JSON.stringify(obj_token).split('"')[3];
                const ani = await this.httpService.axiosRef.get(
                    'https://api.idp.gistory.me/idp/get_user_info',     
                    {
                        params : {
                            jwt_token : token,
                            client_id : this.configService.get('CLIENT_ID'),
                            client_secret_key : this.configService.get('CLIENT_SECRET_KEY')
                        }
                    }
                );
                user_email_id = ani.data.email;
                user_uuid = ani.data.uuid;

                const payload = {user_email_id, user_uuid};
                accessToken = await this.jwtService.sign(payload);
            }
            const found = await this.userRepository.findOne({
                where : {
                    email : user_email_id
                }
            })

            if(!accessToken)
            {
                throw new NotFoundException('잘못된 정보입니다. - ')
            }
            if (found)
            {
                console.log("이미 등록된 유저")
                return {accessToken};
            }
            else{
                console.log("새로 가입하는 유저")
                await this.userRepository
                .createQueryBuilder()
                .insert()
                .into(User)
                .values([
                    { uuid : user_uuid, email : user_email_id, role : role },
                ])
                .execute()
                
                return {accessToken}; // gistalk을 위한 토큰
            }
            
        } catch(err){
            console.log(err)
            throw new ConflictException('잘못된 정보입니다.');
        }

        
    }  
}

