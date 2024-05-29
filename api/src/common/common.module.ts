import { Global, Module } from '@nestjs/common';
import { ConnectionDbService } from './connection-db';

const services = [
    ConnectionDbService
]

@Global()
@Module({
    providers: services,
    exports: services
})
export class CommonModule {}
