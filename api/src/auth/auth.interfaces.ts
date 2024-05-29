import { UserRole } from "@app/models";
import { UUID } from "crypto";

export interface ISession {
    id: string;
    username: string;
    name: string;
    last_name: string;
    token: string;
    role: UserRole;
    permissions: string[];
}