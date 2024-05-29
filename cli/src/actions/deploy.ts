import inquirer from "inquirer";
import chalk from "chalk";
import { getApps, getServers, IApplication, IServer } from "../core.js"
import { createReadStream, createWriteStream, existsSync, ReadStream } from "fs";
import { startSpinner, stopSpinner } from "../utils.js";
import FormData from "form-data";
import archiver from "archiver";
import { basename } from "path";
import { getHttpClient } from "../http-client.js";

export const deploy = async () => {
    let servers: IServer[] = getServers();

    let apps: IApplication[] = getApps();
    let app: IApplication;
    if (apps.length == 0){
        console.log(chalk.redBright("Falta agregar la configuración del proyecto"));
        process.exit(1);
    } else if (apps.length == 1) {
        app = apps[0];
    } else {
        let result: { app: IApplication } = await inquirer.prompt({ name: "app", message: "Selecciones el proyecto", type: "list", choices: apps.map(x => { 
            return {
                name: `${x.domain} - ${x.name}`,
                value: x
            }
        })});

        app = result.app;
    }
    
    let server: IServer | undefined = servers.find(x => x.url == app.server);

    if (!server){   
        console.log(chalk.redBright("Primero se debe iniciar sesión en el servidor: " + app.server ));
        process.exit(1);
    }
    let stream = await generareZip(app);
    let http = getHttpClient(server);
    let formData = new FormData();

    formData.append("id", app.id);
    formData.append("zip", stream);

    startSpinner("Enviado archivos al servidor");

    try {
        let res = await http.post<string>("cli/deploy", formData);
        if (res.data == "online"){
            stopSpinner("Aplicación desplegada correctamente", "✔");
        } else {
            stopSpinner("La aplicación no se cargo correctamente", "✘");
        }
        
    } catch (err: any) {
        stopSpinner(`[${err.status}] Error: ${(err as any).data?.message}`, '✘');
    }
}

const generareZip = (project: IApplication) => {
    return new Promise<ReadStream>((resolve, reject) => {
        const zipName: string = "deploy.zip";
        startSpinner("comprimiendo archivos");
        try {
            if (!existsSync(project.location)){
                stopSpinner(`Directorio no encontrado: ${project.location}`, '✘');
                process.exit(0);
            }
            const ouPut = createWriteStream(zipName);
            const archive = archiver("zip");
            archive.pipe(ouPut);
            archive.directory(project.location, false);
            project.include.forEach((filename: string) => {
                archive.file(filename, { name: basename(filename) });
            });
            archive.on("error", ()   => {
                stopSpinner("Error con la compresión de los archivos", "✘");
                process.exit();
            });
            archive.finalize().then(() => {
                setTimeout(() => {
                    stopSpinner("Archivo comprimidos", "✔");
                    resolve(createReadStream(zipName));
                }, 500);
            })
        } catch (error) {
            stopSpinner("Error inesperado al momento de comprimir los archivos", "✘");
            process.exit();
        }
    })
}