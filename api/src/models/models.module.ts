import { Global, Module } from '@nestjs/common';
import { UsersService } from './services/users/users.service';
import { ApplicationsService } from './services/applications/applications.service';

const services = [
  UsersService
]

@Global()
@Module({
  providers: services,
  exports: services
})
export class ModelsModule {}
