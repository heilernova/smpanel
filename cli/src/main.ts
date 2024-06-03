#!/usr/bin/env node
import { Command } from "commander";
import { factory, getVersion } from "./core.js";
import { login } from "./actions/login.js";
import { deploy } from "./actions/deploy.js";
import { addProject } from "./actions/add-project.js";
import { deleteServer, serverList } from "./actions/servers.js";

factory();
const program = new Command();
program.version(getVersion(), '-v, --version', 'Output the current version.');
program.command('login').action(() => login());
program.command('add').action(() => addProject());

program.command('servers').option('-r').action((s, p) => {
    if (s['r']){
        deleteServer();
    } else {
        serverList();
    }
});

program.action(() => deploy())
program.parse(process.argv);