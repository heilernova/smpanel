import { createParamDecorator, ExecutionContext, HttpException } from '@nestjs/common';
import { Session } from './session';


export const GetSession = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest<Request&{ appSession: Session }>();
        if (request.appSession instanceof Session){
            return request.appSession;
        }
        throw new HttpException('No se cargo correctamente la información de la sesión', 500);
    },
);