import { OmitBy, PartialBy } from "@app/types";

export const USER_ROLE_LIST = ['admin', 'user'] as const;
export const USER_STATUS_LIST = ['active', 'inactive', 'lock'] as const;

export type UserRole = typeof USER_ROLE_LIST[number];
export type UserStatus = typeof USER_STATUS_LIST[number];

export interface IUserDbRow {
    id: string;
    create_at: Date;
    role: UserRole;
    status: UserStatus;
    username: string;
    name: string;
    last_name: string;
    email: string;
    cellphone: string | null;
    permissions: string[];
    password: string;
}

export interface IUserCreate extends PartialBy<OmitBy<IUserDbRow, 'create_at'>, 'id' | 'role' | 'status' | 'cellphone' |  'permissions'> {}
export interface IUSerUpdate extends Partial<IUserCreate> {}
export interface IUser extends IUserDbRow {}

export const USER_LOG_ACTION_LIST = ['auth', 'update', 'password', 'lock'] as const;
export const USER_LOG_STATE_LIST = ['success', 'warning', 'error', 'bug'] as const;
export type UserLogAction = typeof USER_LOG_ACTION_LIST[number];
export type UserLogState = typeof USER_LOG_STATE_LIST[number];

export interface IUserLogDbRow {
    id: string;
    create_at: Date;
    user_id: string;
    action: UserLogAction;
    state: UserLogState;
    detail: string;
}
export interface IUserLogCreate extends PartialBy<OmitBy<IUserLogDbRow, 'create_at'>, 'id'> {};
export interface IUserLog extends OmitBy<IUserLogDbRow, 'user_id'> {};

export const USER_TOKEN_TYPE_LIST = ['web', 'cli'] as const;
export const USER_TOKEN_DEVICE_LIST = ['desktop', 'mobile', 'tablet'] as const;
export type UserTokeType = typeof USER_TOKEN_TYPE_LIST[number];
export type UserTokenDevice = typeof USER_TOKEN_DEVICE_LIST[number];

export interface IUserTokenDbRow {
    id: string;
    create_at: Date;
    user_id: string;
    type: UserTokeType;
    hostname: string;
    ip: string | null;
    device: UserTokenDevice | null;
    platform: string | null;
    exp: Date | null;
}
export interface IUserTokenCreate extends PartialBy<OmitBy<IUserTokenDbRow, 'create_at'>, 'id' | 'device' | 'platform' | 'exp'> {}
export interface IUserToken extends OmitBy<IUserTokenDbRow, 'user_id'> {};