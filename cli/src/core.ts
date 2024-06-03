import { dir } from "node:console";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const APP_CONFIG: IConfig = {
    dirBase: '',
    version: '',
    servers: [],
    cache: {},
    apps: []
}

export const factory = () => {
    const dirBase = dirname(dirname(process.argv[1]));
    const pathConfig: string = join(dirBase, "config.json");
    const pathPackageJSON: string = join(dirBase, "package.json");
    
    // Cargamos las configuraciones globales
    if (!existsSync(pathConfig)){
        writeFileSync(pathConfig, JSON.stringify({ servers: [], cache: {} } as IConfigGlobal, undefined, 4));
    }
    APP_CONFIG.version = JSON.parse(readFileSync(pathPackageJSON).toString()).version ?? '';

    // Configuraciones de espacio de trabajo
    if (!existsSync(join("sm.json"))){
        writeFileSync("sm.json", JSON.stringify({ apps: [] }, undefined, 4));
    }

    let smConfig = JSON.parse(readFileSync("sm.json").toString()) as IConfigWorkspace;

    const config = JSON.parse(readFileSync(pathConfig).toString()) as IConfigGlobal;
    APP_CONFIG.dirBase = dirBase;
    APP_CONFIG.servers = config.servers;
    APP_CONFIG.cache = config.cache;
    APP_CONFIG.apps = smConfig.apps;
}


export const getVersion = () => APP_CONFIG.version;
export const getApps = () => APP_CONFIG.apps;
export const getCache = () => APP_CONFIG.cache;
export const getServers = () => APP_CONFIG.servers;

export const save = (values: { server?: IServer, cache?: { login?: { server: string, username: string } }, application?: IApplication, deleteServer?: string; }) => {

    // Configuraciones globales
    if (values.server || values.cache || values.deleteServer){
        let config: IConfigGlobal = {
            servers: APP_CONFIG.servers,
            cache: APP_CONFIG.cache
        }

        if (values.server) {
            let index: number = config.servers.findIndex(x => x.url == (values.server?.url as string));
            if (index > -1){
                config.servers[index] = values.server;
            } else {
                config.servers.push(values.server);
            }
        }

        if (values.cache){
            if (values.cache.login){
                config.cache.login = values.cache.login;
            }
        }

        if (values.deleteServer){
            let index = config.servers.findIndex(x => x.url == values.deleteServer);
            if (index > -1){
                config.servers.splice(index, 1);
            }
        }

        writeFileSync(join(APP_CONFIG.dirBase, "config.json"), JSON.stringify(config, undefined, 4));
    }

    // Configuraciones del espacio de trabajo
    if (values.application){
        let config: IConfigWorkspace = { 
            apps: APP_CONFIG.apps
        };

        config.apps.push(values.application);
        writeFileSync("sm.json", JSON.stringify(config, undefined, 4));
    }

}

export interface IConfigGlobal {
    servers: IServer[],
    cache: ICache
}

export interface IConfigWorkspace {
    apps: IApplication[]
}

export interface IConfig {
    version: string;
    dirBase: string;
    servers: IServer[],
    cache: ICache,
    apps: IApplication[]
}

export interface IServer {
    url: string;
    username: string;
    token: string;
}

export interface ICache {
    login?: {
        server: string;
        username: string
    }
}

export interface IApplication {
    server: string;
    id: string;
    domain: string;
    name: string;
    location: string;
    include: string[]
}