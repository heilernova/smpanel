import { ConnectionDbService } from '@app/common/connection-db';
import { IUserTokenCreate, IUserTokenDbRow } from '@app/models/interfaces/users.interfaces';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TokensService {
    constructor(private readonly _db: ConnectionDbService){}

    async generate(data: IUserTokenCreate): Promise<IUserTokenDbRow> {
        if (data.type == 'web'){
            let tokens = (await this._db.query<IUserTokenDbRow>("select * from users_tokens where type = 'web' and user_id = $1 order by create_at desc", [data.user_id])).rows;
            if (tokens.length > 3){
                let list = tokens.splice(tokens.length - (tokens.length - 3)).map(x => x.id);
                await this._db.query('delete from users_tokens where id = any($1)', [list]);
            }
        }
        await this._db.delete('users_tokens', ['hostname = $1', [data.hostname]]);
        return (await this._db.insert('users_tokens', data, '*')).rows[0];
    }

    async get(id: string): Promise<IUserTokenDbRow | undefined> {
        return (await this._db.query<IUserTokenDbRow>('select * from users_tokens where id = $1', [id])).rows[0] ?? undefined;
    }
    
    async getAll(filter?: { userId: string }): Promise<IUserTokenDbRow[]> {
        let conditions: string[] = [];
        let params: any[] | undefined = [];
        let sql: string = 'select * from users_tokens';
        if (filter?.userId) conditions.push(`user_id = $${params.push(filter.userId)}`);
        if (conditions.length){
            sql += ` where ${conditions.join(' and ')}`;
        } else {
            params = undefined;
        }
        return (await this._db.query<IUserTokenDbRow>(sql, params)).rows;
    }

    async delete(id: string): Promise<boolean> {
        return (await this._db.delete('users_tokens', ['id = $1', [id]])).rowCount == 1;
    }

    async deleteAll(userId: string, ignoreId: string): Promise<number> {
        return (await this._db.delete('users_tokens', ['user_id = $1 and id <> $2', [userId, ignoreId]])).rowCount ?? 0;
    }
}
