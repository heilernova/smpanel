import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Response } from 'express';
import { map, Observable } from 'rxjs';
import { parseBody } from './parse-body';
@Injectable()
export class AppResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    context.switchToHttp().getResponse<Response>().setHeader('X-Robots-Tag', 'noindex');
    context.switchToHttp().getResponse<Response>().setHeader('robots', 'noindex');
    context.switchToHttp().getResponse<Response>().setHeader('Disallow', '/');
    if (context.switchToHttp().getRequest<Request>().url.startsWith('/media')){
      return next.handle();
    }
    return next.handle().pipe(map(value => {
      return parseBody(value, context.switchToHttp().getResponse<Response>().statusCode);
    }));
  }
}