import { Global, Module } from '@nestjs/common';
import { ConnectionDbService } from './connection-db';
import { Pm2Service } from './pm2/pm2.service';

const services = [
    ConnectionDbService,
    Pm2Service
]

@Global()
@Module({
    providers: services,
    exports: services
})
export class CommonModule {}
