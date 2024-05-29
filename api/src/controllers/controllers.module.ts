import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { ApplicationsController } from './applications/applications.controller';
import { CliApplicationsController } from './cli-applications/cli-applications.controller';
import { CliDeployController } from './cli-deploy/cli-deploy.controller';

@Module({
  controllers: [AuthController, ApplicationsController, CliApplicationsController, CliDeployController]
})
export class ControllersModule {}
