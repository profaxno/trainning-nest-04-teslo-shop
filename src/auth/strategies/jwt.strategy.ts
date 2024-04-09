import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

import { ConfigService } from '@nestjs/config';
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { User } from "../entities/user.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    
    // constructor(){
    //     super({
    //         jwtFromRequest: (req) => {
    //             let token = null;
    //             if(req && req.cookies){
    //                 token = req.cookies['jwt'];
    //             }
    //             return token;
    //         },
    //         ignoreExpiration: false,
    //         secretOrKey: 'secret'
    //     });
    // }

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        configService: ConfigService
    ){
        super({
            secretOrKey: configService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        });
    }


    async validate(payload: JwtPayload): Promise<User>{
        const {id} = payload;
        
        const user = await this.userRepository.findOneBy({id});

        if(!user){
            throw new UnauthorizedException('Token not valid');
        }

        if(!user.isActive){
            throw new UnauthorizedException('User is inactive, talk with an admin');
        }

        return user;
    }
}