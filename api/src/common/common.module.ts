import { Global, Module } from '@nestjs/common';
import { ConnectionDbService } from './connection-db';
import { Pm2Service } from './pm2/pm2.service';
import { DeployService } from './deploy/deploy.service';

const services = [
    ConnectionDbService,
    Pm2Service,
    DeployService
]

@Global()
@Module({
    providers: services,
    exports: services
})
export class CommonModule {}
