import { Global, Module } from '@nestjs/common';
import { UsersService } from './services/users/users.service';
import { ApplicationsService } from './services/applications/applications.service';
import { TokensService } from './services/tokens/tokens.service';

const services = [
  UsersService,
  ApplicationsService,
  TokensService
]

@Global()
@Module({
  providers: services,
  exports: services
})
export class ModelsModule {}
