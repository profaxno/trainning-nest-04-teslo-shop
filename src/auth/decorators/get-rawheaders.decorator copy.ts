import { InternalServerErrorException, createParamDecorator } from "@nestjs/common";
import { User } from '../entities/user.entity';

export const GetRawHeaders = createParamDecorator(
    (data, ctx) => {
        const req = ctx.switchToHttp().getRequest();
        const rawHeaders = req.rawHeaders;

        if(!rawHeaders) throw new InternalServerErrorException('rawHeaders not found (request)')

        return rawHeaders;
    }
)