import inquirer from "inquirer"
import { getCache, save } from "../core.js"
import { startSpinner, stopSpinner } from "../utils.js";
import { getHttpClient } from "../http-client.js";
import os from "node:os";

export const login = async () => {
    let cache = getCache();

    let data: { server: string, username: string, password: string } = await inquirer.prompt([
        { name: "server", message: "Server", type: "input", default: cache.login?.server },
        { name: "username", message: "Username", type: "input", default: cache.login?.username },
        { name: "password", message: "Password", type: "password", mask: "*" }
    ]);

    data.server = data.server.replace(/\/$/, '');
    save({ cache: { login: {  server: data.server, username: data.username } } });
    startSpinner("Validando credenciales");
    let http = getHttpClient();

    try {
        let url: string = `${data.server}/api/sign-in`
        let rest = await http.post<{ name: string, role: string, token: string }>(url, { hostname: os.hostname(), username: data.username, password: data.password });
        save({ server: {
            url: data.server,
            username: data.username,
            token: rest.data.token
        } });
        stopSpinner("Sesión guardada correctamente", "✔");        
    } catch (error: any) {
        let message = "Error inesperado";
        if (error.status == 404) message = "La ruta es incorrecta";
        if (error.status == 400) message = "Credenciales incorrectas";
        if (error.status == 500) message = "Error con el servidor";
        stopSpinner(message, "✘");
    }
}