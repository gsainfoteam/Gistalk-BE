import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "./entity/user.entity";
import { Repository } from "typeorm";
import { PaylaodDto } from "./dto/payload.dto";
import { AuthParse } from "src/utils/utils";

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


    async validate(payload : PaylaodDto){
        const user = await this.userRepository.find({
            select : {
                id : true,
                uuid : true,
                email : true,
                authorities : true
            },
            relations : {
                authorities : true
            },
            where : {
                uuid : payload.uuid
            }
        })

        if(!user) {
            throw new UnauthorizedException();
        }
    
        const result : PaylaodDto = {
            id : user[0].id,
            uuid: user[0].uuid,
            email : user[0].email,
            authorities : AuthParse(user)
        };
        return result;
    }
}