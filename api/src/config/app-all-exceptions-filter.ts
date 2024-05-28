import { Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { DatabaseError } from 'pg';
import { parseErrorBody } from './parse-body';


@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        let body = parseErrorBody('Error interno del servidor', undefined, 500);

        if (process.env.NODE_ENV == 'development'){
            if (exception instanceof HttpException){
                let res = exception.getResponse();
                body.status_code = exception.getStatus();
                if (typeof res == 'string'){
                    body.message = res;
                } else {
                    body.message = (res as any).message;
                    (res as any).message = undefined;
                    body.detail = (res as any).detail;
                }
            } else if (exception instanceof DatabaseError){
                body.message = exception.message;
                body.detail = {
                    message: (exception as any).detail,
                    command: (exception as any).query.command,
                    params: (exception as any).query.params,
                }
            } else {
                body.message = (exception as any).message;
            }
        }

        super.catch(new HttpException(body, body.status_code), host);
    }
}