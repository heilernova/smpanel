import { Dirent, existsSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { Injectable } from '@nestjs/common';
import { IApplication } from '@app/models';
import * as extract from 'extract-zip';
import { join } from 'path';
import { execSync } from 'node:child_process';
import { Pm2Process, Pm2Service } from '../pm2';

@Injectable()
export class DeployService {
    constructor(private readonly _pm2: Pm2Service){}

    async run(app: IApplication, zip: Buffer){
        if (app.framework == 'Angular') return this.forAngular(app, zip);
        if (app.framework == 'NestJS') return this.forNestJS(app, zip);
        return null;
    }

    private async clearDir(location: string, ignore: string[]): Promise<string[]> {
        let list: Dirent[] = readdirSync(`${location}`, { withFileTypes: true });
        let fileToDelete: Dirent[]  = list.filter(x => !ignore.some(y => y = x.name));
        return Promise.all(fileToDelete.map(async x => {
            rmSync(join(x.parentPath, x.name), { force: true, recursive: true })
            return x.name;
        }))
    }

    private async extractFiles(appId: string, location: string, buffer: Buffer){
        let name: string = `zi-temp-${appId}.zip`;
        writeFileSync(name, buffer);
        await extract(name, { dir: location });
        rmSync(name);
    }

    private async forAngular(app: IApplication, zip: Buffer){
        this.clearDir(app.location, app.ignore);
        await this.extractFiles(app.id, app.location, zip);
        if (app.running_on == 'PM2'){
            return this._pm2.runApp(app);
        } else {
            return 'online'
        }
    }

    private async forNestJS(app: IApplication, zip: Buffer){
        let currentPackage: { [p: string]: any } | undefined;
        let newPackage: { [p: string]: any } | undefined;
        let executeNPMInstall: boolean = false;
        
        if (existsSync(join(app.location, 'package.json'))){
            currentPackage = JSON.parse(readFileSync(join(app.location, 'package.json')).toString());
        }

        if (app.running_on == 'PM2'){
            app.ignore.push('node_modules');
            this.clearDir(app.location, app.ignore);
            await this.extractFiles(app.id, app.location, zip);

            if (existsSync(join(app.location, 'package.json'))){
                newPackage = JSON.parse(readFileSync(join(app.location, 'package.json')).toString());
            }
            
            if (!existsSync(join(app.location, 'node_modules'))) {
                executeNPMInstall = true;
            } else {
                let dependencies1 = currentPackage ? currentPackage['dependencies'] : {};
                let dependencies2 = newPackage ? newPackage['dependencies'] : {};
                if (Object.keys(dependencies1) != Object.keys(dependencies2)) {
                    executeNPMInstall = true;
                } else {
                    Object.entries(dependencies2).forEach(entry => {
                        if (entry[1] != dependencies1[entry[0]]){
                            executeNPMInstall = true;
                        }
                    })
                }
            }

            if (executeNPMInstall){
                execSync('npm i --omit=dev', { cwd:  app.location  });
            }

            return this._pm2.runApp(app);
        } else {
            return null;
        }
    }
}
