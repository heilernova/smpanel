import { Injectable } from '@nestjs/common';
import { IUser, IUserCreate, IUserDbRow, IUSerUpdate, UserStatus } from '@app/models/interfaces/users.interfaces';
import { ConnectionDbService } from '@app/common/connection-db';
import { capitalize, convertToSlug } from '@app/common/utils';
import { hashSync } from 'bcrypt';
import { isEmail } from 'class-validator';

export type FilterUsers = { status?: UserStatus, ignoreId: string }

@Injectable()
export class UsersService {
    constructor(private readonly _db: ConnectionDbService){}

    private parseValues<T = IUserCreate | IUSerUpdate>(data: IUserCreate | IUSerUpdate): T {
        if (data.email) data.email = data.email.toLowerCase();
        if (data.name) data.name = capitalize(data.name);
        if (data.last_name) data.last_name = capitalize(data.last_name);
        if (data.password) data.password = hashSync(data.password, 10);
        return data as T;
    }

    async create(data: IUserCreate): Promise<IUser> {
        return (await this._db.insert<IUserDbRow>('users', this.parseValues(data), '*')).rows[0];
    }

    async get(value: string): Promise<IUser | undefined> {
        let regExp = /^[-+]?[0-9A-Fa-f]+\.?[0-9A-Fa-f]*?$/;
        let sql: string = `select * from users where ${(value.length == 12 && regExp.test(value)) ? 'id = $1' : (isEmail(value) ? 'email = lower($1)' : 'lower(username) = lower($1)')}`;
        return (await this._db.query<IUserDbRow>(sql, [value])).rows[0] ?? undefined;
    }

    async getAll(filter?: FilterUsers): Promise<IUser[]> {
        let sql: string = 'select * from users';
        let params: any[] = [];
        let conditions: string[] = [];
        if (filter?.status) conditions.push(`status = $${params.push(filter.status)}`);
        if (filter?.ignoreId) conditions.push(`id <> $${params.push(filter.ignoreId)}`);
        if (conditions.length > 0){
            sql += ' where ' + conditions.join(' and ');
            return (await this._db.query(sql, params)).rows;
        }
        return (await this._db.query(sql)).rows;
    }

    async update(id: string, data: IUSerUpdate): Promise<boolean> {
        return (await this._db.update('users', ['id = $1', [id]], this.parseValues(data))).rowCount == 1;
    }

    async delete(id: string): Promise<boolean> {
        return (await this._db.delete('users', ['id = $1', [id]])).rowCount == 1;
    }

    async emailAndUsernameValid(email: string, username: string, userId?: string): Promise<{ email: boolean, username: boolean }> {
        let sql: string = 'select (select count(*) = 0 from users where email = lower($1)), (select count(*) = 0 from users where lower(username) = lower($2))';
        let params: any[] = [email, username];
        if (userId){
            sql = 'select (select count(*) = 0 from users where email = lower($1) and id <> $3), (select count(*) = 0 from users where lower(username) = lower($2) and id <> $3)';
            params.push(userId);
        }
        const [emailValid, usernameValid] = (await this._db.query(sql, params, true)).rows[0];
        return {
            email: emailValid,
            username: usernameValid
        }
    }
}
