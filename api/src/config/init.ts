import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import * as dotenv from 'dotenv';

export const  APP_CONFIG = {
    version: ''
}

export const appInitConfig = () => {
    if (existsSync('package.json')){
        let packageObj = JSON.parse(readFileSync('package.json').toString());
        APP_CONFIG.version = packageObj.version;
    }

    if (existsSync('.env')) dotenv.config({ path: '.env'});
}