import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { APP_CONFIG } from './init';

@Injectable()
export class AppResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    context.switchToHttp().getResponse<Response>().setHeader('X-App-version', APP_CONFIG.version);
    context.switchToHttp().getResponse<Response>().setHeader('X-Robots-Tag', 'noindex');
    context.switchToHttp().getResponse<Response>().setHeader('robots', 'noindex');
    context.switchToHttp().getResponse<Response>().setHeader('Disallow', '/');
    return next.handle();
  }
}