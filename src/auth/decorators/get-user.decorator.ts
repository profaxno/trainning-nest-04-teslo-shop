import { InternalServerErrorException, createParamDecorator } from "@nestjs/common";
import { User } from '../entities/user.entity';

export const GetUser = createParamDecorator(
    (data, ctx) => {
        const req = ctx.switchToHttp().getRequest();
        const user = req.user;

        if(!user) throw new InternalServerErrorException('User not found (request)')

        //console.log({data, user});

        const result = (data) ? user[data] : user;

        return result;
    }
)