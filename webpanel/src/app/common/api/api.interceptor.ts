import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  let url: string = `${environment.URL_API}/${req.url}`;
  return next(req.clone({ url }));
};
