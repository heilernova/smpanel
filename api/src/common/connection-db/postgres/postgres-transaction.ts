import { PoolClient, QueryResult, QueryResultRow } from "pg";
import { PostgreSQLQueries } from "./postgres-queries";

export class PostgreSQLTransaction extends PostgreSQLQueries {
    async commit(){
        try {
            await this._connection.query('COMMIT');
        } catch (error) {
            this._connection.query('ROLLBACK');
            throw error;
        }
    }
}