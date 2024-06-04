import { ConnectionDbService } from '@app/common/connection-db';
import { Pm2Process } from '@app/common/pm2';
import { ApplicationStatus, IApplication, IApplicationCreate, IApplicationDbRow, IApplicationUpdate } from '@app/models/interfaces/applications.interfaces';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ApplicationsService {
    constructor(
        private readonly _db: ConnectionDbService,
    ){}

    async create(data: IApplicationCreate): Promise<IApplication> {
        return (await this._db.insert<IApplicationDbRow>('apps', data, '*')).rows[0];
    }

    async get(id: string): Promise<IApplication | undefined> {
        return (await this._db.query<IApplicationDbRow>('select *  from apps where id = $1', [id])).rows[0] ?? undefined;
    }

    async getAll(): Promise<IApplication[]> {
        let sql: string = 'select * from apps';
        return (await this._db.query<IApplicationDbRow>(sql)).rows;
    }
    async getAllForUser(userId: string): Promise<IApplication[]> {
        let sql: string = 'select a.* from apps a inner join apps_users b on a.id = b.user_id where b.id = $1';
        return (await this._db.query<IApplicationDbRow>(sql, [userId])).rows;
    }

    async update(id: string, value: IApplicationUpdate): Promise<boolean> {
        return (await this._db.update('apps', ['id = $1', [id]], value)).rowCount == 1;
    }

    async delete(id: string): Promise<boolean> {
        return (await this._db.delete('apps', ['id = $1', [id]])).rowCount == 0;
    }

    async nameValid(value: string, domain: string): Promise<boolean> {
        let sql: string = 'select count(*) = 0 from apps where name = $1 and domain = $2';
        return (await this._db.query<[boolean]>(sql, [value, domain], true)).rows[0][0];
    }

    async getPermission(appId: string, userId: string): Promise<string[]> {
        let row = (await this._db.query<[string[]]>('select permissions from apps_users where app_id = $1 and user_id = $2', [appId, userId], true)).rows[0] ?? undefined;
        if (row) return row[0];
        return [];
    }

    async assignUser(appId: string, userId: string, permissions: string[]){
        await this._db.insert('apps_users', { user_id: userId, app_id: appId, permissions });
    }

    async removeUser(appId: string, userId: string): Promise<boolean> {
        return (await this._db.delete('apps_users', ['app_id = $1 and user_id = $2', [appId, userId]])).rowCount == 1;
    }
}
