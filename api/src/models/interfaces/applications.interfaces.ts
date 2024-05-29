import { OmitBy, PartialBy } from "@app/types";

export const APP_FRAMEWORK_LIST = ['NestJS', 'Angular', 'FastAPI'] as const;
export const APP_RUNNING_ON = ['PM2', 'Docker', 'LiteSpeed', 'Apache'] as const;
export const APP_RUNTIME_ENVIRONMENT = ['Node.js', 'Python', 'PHP', 'GO'] as const;
export const APP_LOG_TYPE = ['error', 'reset', 'deploy', 'stop', 'start'] as const;

export type AppFramework = typeof APP_FRAMEWORK_LIST[number];
export type AppRunningOn = typeof APP_RUNNING_ON[number];
export type AppRuntimeEnvironment = typeof APP_RUNTIME_ENVIRONMENT[number];
export type AppLogType = typeof APP_LOG_TYPE[number];

export type ApplicationStatus = 'online' | 'stopping' | 'stopped' | 'launching' | 'errored' | 'one-launch-status';

export interface IApplicationDbRow {
    id: string;
    create_at: Date;
    update_at: Date;
    last_deploy_at: Date | null;
    domain: string;
    name: string;
    version: string | null;
    location: string;
    startup_file: string;
    framework: AppFramework | null;
    running_on: AppRunningOn | null;
    runtime_environment: AppRuntimeEnvironment | null;
    url: string | null;
    github: { type: "git", url: string, directory?: string } | null;
    env: { [key: string]: string };
    ignore: string[];
    observation: string | null;
}

export interface IApplicationCreate extends PartialBy<OmitBy<IApplicationDbRow, 'create_at' | 'update_at' | 'last_deploy_at'>, 'id' | 'version' | 'startup_file' | 'framework' | 'running_on' | 'runtime_environment' | 'url' | 'github' | 'env' | 'ignore' | 'observation'> {};
export interface IApplicationUpdate extends Partial<OmitBy<IApplicationDbRow, 'id' | 'create_at'>> {};
export interface IApplication extends IApplicationDbRow {};

export interface IApplicationUsersDbRow {
    app_id: string;
    user_id: string;
    permissions: ('APP_CREATE' | 'APP_READ' | 'APP_UPDATE' | 'APP_DELETE' | 'APP_RELOAD' | 'APP_DEPLOY')[];
}

export interface IApplicationLogDbRow {
    id: string;
    create_at: Date;
    app_id: string;
    type: AppLogType;
    detail: string;
}