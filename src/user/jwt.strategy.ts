import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "./entity/user.entity";
import { Repository } from "typeorm";

@Injectable()

export class JwtStrategy extends PassportStrategy(Strategy){

    constructor(
        @InjectRepository(User)
        private userRepository : Repository<User>,
    ){
        super({
            secretOrKey: 'gistalk2023',
            jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken()
        });
    }


    async validate(payload){
        const {user_uuid, user_email_id} = payload;
        const user = await this.userRepository.findOne({
            where : {
                email : user_email_id,
                uuid : user_uuid
            }
        })

        if(!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}