
import chalk from "chalk";
import inquirer from "inquirer";
import { getApps, getServers, IServer, save } from "../core.js";
import { getHttpClient } from "../http-client.js";
import { startSpinner, stopSpinner } from "../utils.js";

export const addProject = async () => {
    let servers: IServer[] = getServers();
    let server: IServer;

    if (servers.length == 0){
        console.log(chalk.redBright("Falta iniciar sesión"));
        process.exit(1);
    } else if (servers.length == 1){
        server = servers[0];
    } else {
        let result: { server: IServer } = await inquirer.prompt({ name: "server", message: "Selecciones el servidor", type: "list", choices: servers.map(x => { 
            return {
                name: x.url,
                value: x
            }
        })});

        server = result.server;
    }


    let http = getHttpClient(server);

    try {
        startSpinner("Cargados aplicaciones del servidor");
        let res = await http.get<{ id: string, domain: string, name: string, framework: string, running_on: string, runtime_environment: string }[]>("cli/applications");
        if (res.data.length == 0){
            console.log("Primero debe crear aplicaciones en el servidor");
            process.exit(0);
        }
        stopSpinner("Aplicaciones cargadas", "✔");
        let r: {
            app: { id: string, domain: string, name: string, framework: string, running_on: string, runtime_environment: string },
            location: string,
            include: string
        } = await inquirer.prompt([
            {
                name: "app",
                message: "Selecciones la aplicación",
                type: "list",
                choices: res.data.map(x => {
                    return {
                        name: `${x.domain} - ${x.name}`,
                        value: x
                    }
                })
        	},
            {
                name: "location",
                message: "Ubicación del build de la aplicación",
                type: "input"
            },
            {
                name: "include",
                message: "Archivos a incluir",
                type: "input"
            }
        ])


        save({
            application: {
                id: r.app.id,
                server: server.url,
                domain: r.app.domain,
                name: r.app.name,
                location: r.location,
                include: r.include.split(",").map(x => x.trim()).filter(x => x.length > 0)
            }
        })

    } catch (error: any) {
        stopSpinner("Error con el servidor", "✘");
    }

}