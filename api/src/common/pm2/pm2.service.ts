import { IApplication } from '@app/models';
import { Injectable } from '@nestjs/common';
import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

export interface Pm2Process {
    pm_id: number,
    pid: number,
    name: string,
    pm2_env: { [key: string]: any }&{
        exit_code: number,
        node_version: string,
        version: string;
        PORT: string;
        status: "online" | "stopping" | "stopped" | "launching" | "errored" | "one-launch-status";
        pm_err_log_path: string;
        pm_out_log_path: string;
        pm_cwd: string;
        pm_exec_path: string;
        unstable_restarts: number;
        restart_time: number;
        pm_uptime: number;

    },
    monit: {
        cpu: number,
        memory: number
    }
}

@Injectable()
export class Pm2Service {
    getAll(): Pm2Process[] {
        let result = execSync('pm2 jlist');
        return JSON.parse(result.toString());
    }

    start(path: string, script: string, name: string, env: { [key: string]: string }): void {
        execSync(`pm2 start ${script} --name=${name}`, { cwd: path, env: { ...process.env, ...env } });
    }

    stop(value: string | number): void {
        execSync(`pm2 stop ${value}`);
    }

    reload(value: string | number, path: string, env?: { [key: string]: string }): void {
        if (typeof value == 'string'){
            let process = this.getAll().find(x => x.name == value);
            if (process){
                value = process.pm_id;
            } else {
                return;
            }
        }
        if (env){
            execSync(`pm2 reload ${value} --update-env`, { env: { ...process.env, ...env } });
        } else {
            execSync(`pm2 reload ${value}`);
        }
    }

    delete(value: string | number): void {
        execSync(`pm2 delete ${value}`);
    }

    runApp(app: IApplication){
        let processName: string = `${app.domain}__${app.name}`.toLowerCase();
        let process: Pm2Process | undefined = this.getAll().find(x => x.name == processName);

        if (app.startup_file && existsSync(join(app.location, app.startup_file))){
            if (process){
                this.reload(process.pm_id, app.location, app.env);
            } else {
                this.start(app.location, app.startup_file, processName, app.env);
            }
    
            process = this.getAll().find(x => x.name == processName);
            if (process){
                return process.pm2_env.status;
            } else {
                return "errored";
            }
        }
        throw new Error("No se ha definido el archivo de arranque:  " + join(app.location, app.startup_file));
    }
}
