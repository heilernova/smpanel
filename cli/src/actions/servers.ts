import inquirer from "inquirer";
import { IServer, getServers, save } from "../core.js";

export const serverList = () => {
    let servers: IServer[] = getServers();
    console.table(servers);
}

export const deleteServer = async () => {
    let servers: IServer[] = getServers();
    let result = await inquirer.prompt({
        type: 'list',
        name: 'server',
        message: 'Selecciones el servidor',
        choices: servers.map(x => {
            return {
                value: x.url,
                name: x.url
            }
        })
    })

    if (result.server){
        save({ deleteServer: result.server });
    }
}