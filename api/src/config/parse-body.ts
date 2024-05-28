import { APP_CONFIG } from "./init";

const links = [
    "https://smpanel.novah.dev",
    "https://smpanel.novah.dev/support",
    "https://www.novah.dev",
    "https://github.com/heilernova",
];

export const parseBody = (data: any, statusCode: number): IResponseAPI => {
    return {
        name: 'SM Panel',
        version: APP_CONFIG.version,
        status_code: statusCode,
        data,
        links,
    }
}

export const parseErrorBody = (message: string, detail: any, statusCode: number): IResponseErrorAPI => {
    return {
        name: 'SM Panel',
        version: APP_CONFIG.version,
        status_code: statusCode,
        message,
        detail,
        links
    }
}

export interface IResponseAPI {
    name: string;
    version: string;
    status_code: number;
    data: any;
    links: string[];
}

export interface IResponseErrorAPI {
    name: string;
    version: string;
    status_code: number;
    message: string;
    detail: any;
    links: string[];
}