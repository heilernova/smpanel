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
        return (await this._db.query<IApplicationDbRow>('select *,  from apps where id = $1', [id])).rows[0] ?? undefined;
    }

    async getAll(): Promise<IApplication[]> {
        let sql: string = 'select * from apps';
        return (await this._db.query<IApplicationDbRow>(sql)).rows;
    }

    async update(id: string, value: IApplicationUpdate): Promise<boolean> {
        return (await this._db.update('apps', ['id = $1', [id]], value)).rowCount == 1;
    }

    async delete(id: string): Promise<boolean> {
        return (await this._db.delete('apps', ['id = $1', [id]])).rowCount == 0;
    }
}
