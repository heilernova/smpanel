import { CanActivate, ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ISession } from './auth.interfaces';
import { ConnectionDbService } from '@app/common/connection-db';
import { Reflector } from '@nestjs/core';
import { Session } from './session';
import { PERMISSION_KEY } from './permissions';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly _db: ConnectionDbService, private reflector: Reflector){}

  async getSession(token: string): Promise<ISession&{ password: string } | undefined>{
    let sql: string = 'select b.id, b.username, b.name, b.last_name, b.role, b.permissions, b.password, a.id as token from users_tokens a inner join users b on b.id = a.user_id where a.id = $1';
    return (await this._db.query(sql, [token])).rows[0];
  }
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    let token = context.switchToHttp().getRequest<Request>().headers['app-token'];
    if (typeof token == 'string') {
      let session = await this.getSession(token);
      if (session){
        let appSession = new Session(session);
        context.switchToHttp().getRequest<Request&{ appSession: Session }>().appSession = appSession;

        const requiredPermissions: string[] | undefined | null = this.reflector.getAllAndOverride<string[]>(PERMISSION_KEY, [
          context.getHandler(),
          context.getClass(),
        ]);
    
        if (requiredPermissions && requiredPermissions.length > 0){
          return appSession.checkPermissions(requiredPermissions);
        }
        return true;
      }
    }
    throw new HttpException('Se require autenticación', 401);
  }
}
