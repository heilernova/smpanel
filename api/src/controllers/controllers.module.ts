import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { ApplicationsController } from './applications/applications.controller';
import { CliApplicationsController } from './cli-applications/cli-applications.controller';
import { CliDeployController } from './cli-deploy/cli-deploy.controller';
import { ProfileController } from './profile/profile.controller';

@Module({
  controllers: [AuthController, ApplicationsController, CliApplicationsController, CliDeployController, ProfileController]
})
export class ControllersModule {}
