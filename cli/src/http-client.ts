import axios from "axios";
import { AxiosResponse } from "axios";
import FormData from "form-data";
import { stopSpinner } from "./utils.js";
import { IServer } from "./core.js";

type Method = 'GET' | 'POST' | 'DELETE' | 'PATCH';
type Body = { [key:string]: any } | FormData;



export class HttpClient {
    private _server?: IServer;

    constructor(server?: IServer){
        if (server){
            this._server = server;
        }
    }

    private send<R = any>(url: string, method: Method, body?: Body, headers?: { [key: string]: string }) {
        return new Promise<AxiosResponse<R, any>>((resolve, reject) => {
            let headers: { [key: string]: string } | undefined;
            if (this._server){
                url = `${this._server.url}/${url}`;
                headers = {
                    "app-token": this._server.token
                }
            }
            axios({ url, method, headers, data: body  })
            .then(res => {
                res.data = res.data.data;
                resolve(res)
            })
            .catch(err => {
                if (err.response){
                    reject(err.response);
                } else if (err.request){
                    stopSpinner(`There was no response from the server ${method} ${url}`, '✘');
                    process.exit();
                } else {
                    stopSpinner('Error preparing HTTP request', '✘');
                    process.exit(1);
                }
            })
        })
    }

    server(server: IServer): HttpClient {
        return new HttpClient(server);
    }

    post<R = any>(url: string, body: Body): Promise<AxiosResponse<R, any>>{
        return this.send<R>(url, 'POST', body);
    }
    get<R = any>(url: string): Promise<AxiosResponse<R, any>> {
        return this.send<R>(url, 'GET');
    }
}

export const getHttpClient = (server?: IServer) => new HttpClient(server);