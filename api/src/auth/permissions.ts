import { SetMetadata } from "@nestjs/common";

export enum Permission {
    USERS_CREATE = 'USERS_CREATE',
    USERS_READ = 'USERS_READ',
    USERS_UPDATE = 'USERS_UPDATE',
    USERS_DELETE = 'USERS_DELETE',

    
    APP_CREATE = 'APP_CREATE',
    APP_READ = 'APP_READ',
    APP_UPDATE = 'APP_UPDATE',
    APP_DELETE = 'APP_DELETE', 
    APP_DEPLOY = 'APP_DEPLOY', 
    APP_ASSIGN_USERS = 'APP_ASSIGN_USERS', 
}

export const PERMISSION_KEY = 'appPermissions';
export const RequirePermissions = (...roles: Permission[]) => {
    return SetMetadata(PERMISSION_KEY, roles);
}