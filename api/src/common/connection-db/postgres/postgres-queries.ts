import { Pool, PoolClient, QueryResult, QueryResultRow } from "pg";

export class PostgreSQLQueries {
    protected _connection: Pool | PoolClient;

    constructor(conn: Pool | PoolClient){
        this._connection = conn;
    }

    async query<T extends QueryResultRow = any>(sql: string, params?: any[], arrayMode?: false): Promise<QueryResult<T>>;
    async query<T extends any[] = any[]>(sql: string, params?: any[], arrayMode?: true): Promise<QueryResult<T>>;
    async query(): Promise<any> {
        try {
            if (arguments[2]){
                return await this._connection.query({ text: arguments[0], values: arguments[1], rowMode: 'array' });
            } else {
                return await this._connection.query(arguments[0], arguments[1]);
            }
        } catch (error) {
            error.query = {
                command: arguments[0],
                params: arguments[1]
            }
            throw error;
        }
    }

    async insert<T extends QueryResultRow = any, V = { [column: string]: any }>(query: { table: string, values: V | V[], returning?: string | string[] }): Promise<QueryResult<T>>;
    async insert<T extends any[] = any[], V = { [column: string]: any }>(query: { table: string, values: V | V[], returning?: string | string[], arrayMode?: true }): Promise<QueryResult<T>>;
    async insert<T extends QueryResultRow = any, V = { [column: string]: any }>(table: string, values: V | V[], returning?: string | string[], arrayMode?: false): Promise<QueryResult<T>>;
    async insert<T extends any[] = any[], V = { [column: string]: any }>(table: string, values: V |V[], returning?: string | string[], arrayMode?: true): Promise<QueryResult<T>>;
    async insert(): Promise<any> {
        let arrayMode: boolean | undefined;
        let params: any[] = [];
        let table: string;
        let values: {}[] | {};
        let returning: string | string[] | undefined;
        let columnsString: string = '';
        let valuesString: string = '';
        let returningString: string =  '';

        if (typeof arguments[0] == 'string'){
            table = arguments[0];
            values = arguments[1];
            returning = arguments[2];
        } else {
            table = arguments[0].table;
            values = arguments[0].values;
            returning = arguments[0].returning;
        }

        if (Array.isArray(values)){
            columnsString = Object.keys(values).join('", "');
            valuesString = (values as any[]).reduce<string>((acc, current) => {
                return `${acc}, (${Object.values(current).reduce<string>((a, p) => `${a}, $${params.push(p)}`, '').substring(2)})`;
            }, '').substring(2);
        } else {
            Object.entries(values).filter(x => x[1] !== undefined).forEach(entry => {
                columnsString += `, "${entry[0]}"`;
                valuesString += `, $${params.push(entry[1])}`;
            });
            columnsString = columnsString.substring(2);
            valuesString = valuesString.substring(2);
        }

        if (returning){
            if (Array.isArray(returning)){
                returningString = `returning ${returning.join(', ')}`;
            } else {
                returningString = `returning ${returning}`;
            }
        }
        return this.query(`INSERT INTO ${table}(${columnsString}) VALUES(${valuesString}) ${returningString}`, params);
    }

    async update<T extends QueryResultRow = any>(query: { table: string, condition: [string, any[]] | string , update: { [column: string] : any }, returning?: string | string[] }): Promise<QueryResult<T>>;
    async update<T extends any[] = any[]>(query: { table: string, condition: [string, any[]] | string , update: { [column: string] : any }, returning?: string | string[], arrayMode?: true }): Promise<QueryResult<T>>;
    async update<T extends QueryResultRow = any, V = { [column: string] : any }>(table: string, condition: [string, any[]] | string , update: V, returning?: string | string[], arrayMode?: false): Promise<QueryResult<T>>;
    async update<T extends any[] = any[]>(query: { table: string, condition: [string, any[]] | string , update: { [column: string] : any }, returning?: string | string[], arrayMode?: true }): Promise<QueryResult<T>>;
    async update(): Promise<any> {
        let table: string = '';
        let params: any[] = [];
        let returning: string | string[] | undefined;
        let update: { [column: string]: any };
        let values: string = '';
        let condition: string = '';
        let returningString: string = '';

        if (typeof arguments[0] == 'string'){
            table = arguments[0];
            update = arguments[2];
            condition = arguments[1][0];
            returning = arguments[3];
            if (arguments[1][1]) params = arguments[1][1];
            Object.entries(arguments[2]).filter(x => x[1] !== undefined).forEach(entry => {
                values += `, ${entry[0]} = $${params.push(entry[1])}`;
            });
            values = values.substring(2);
        }

        if (returning){
            if (Array.isArray(returning)){
                returningString = `returning ${returning.join(', ')}`;
            } else {
                returningString = `returning ${returning}`;
            }
        }
        return this.query(`UPDATE ${table} SET ${values} WHERE ${condition} ${returningString}`, params);
    }

    async delete<T extends QueryResultRow = any>(query: { table: string, condition: string | [string, any[]], returning?: string | string[] }): Promise<QueryResult<T>>;
    async delete<T extends any[] = any[]>(query: { table: string, condition: string | [string, any[]], returning?: string | string[], arrayMode?: true }): Promise<QueryResult<T>>;
    async delete<T extends QueryResultRow = any>(table: string, condition: string | [string, any[]], returning?: string | string[], arrayMode?: false): Promise<QueryResult<T>>;
    async delete<T extends any[] = any[]>(table: string, condition: string | [string, any[]], returning?: string | string[], arrayMode?: true): Promise<QueryResult<T>>;
    async delete(): Promise<any> {
        let table: string;
        let params: any[] | undefined;
        let condition: string = '';
        let returning: string = '';
        if (typeof arguments[0] == 'string'){
            table = arguments[0];
            if (typeof arguments[1] == 'string'){
                condition = arguments[1];
            } else {
                condition = arguments[1][0];
                params = arguments[1][1];
            }
        } else {
            table = arguments[0].table;
        }

        return this.query(`DELETE FROM ${table} WHERE ${condition} ${returning}`, params);
    }
}