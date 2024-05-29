import { UUID } from "crypto";
import { compareSync } from "bcrypt";
import { UserRole } from "@app/models";
import { ISession } from "./auth.interfaces";

export class Session implements ISession {
    public readonly id: string;
    public readonly username: string;
    public readonly name: string;
    public readonly last_name: string;
    public readonly token: string;
    public readonly role: UserRole;
    public readonly permissions: string[];
    private readonly _passwordHash: string;

    constructor(data: ISession&{ password: string }){
        this.id = data.id;
        this.username = data.username;
        this.name = data.name;
        this.last_name = data.last_name;
        this.token = data.token;
        this.role = data.role;
        this.permissions = data.permissions;
        this._passwordHash = data.password;
    }

    checkPassword(password: string): boolean {
        return compareSync(password, this._passwordHash);
    }

    checkPermissions(permissions: string[]): boolean {
        let valid: boolean = true;
        if (this.role == 'admin') return true;
        for (let i = 0; i < permissions.length; i++){
            let r: boolean = this.permissions.some(x => x == permissions[i]);
            if (!r) {
                valid = false;
                break;
            }
        }
        return valid;
    }
}