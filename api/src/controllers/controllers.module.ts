import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { ApplicationsController } from './applications/applications.controller';
import { CliApplicationsController } from './cli-applications/cli-applications.controller';

@Module({
  controllers: [AuthController, ApplicationsController, CliApplicationsController]
})
export class ControllersModule {}
