import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { ApplicationsController } from './applications/applications.controller';
import { CliApplicationsController } from './cli-applications/cli-applications.controller';
import { CliDeployController } from './cli-deploy/cli-deploy.controller';
import { ProfileController } from './profile/profile.controller';
import { ProfileTokensController } from './profile-tokens/profile-tokens.controller';
import { UsersController } from './users/users.controller';

@Module({
  controllers: [AuthController, ApplicationsController, CliApplicationsController, CliDeployController, ProfileController, ProfileTokensController, UsersController]
})
export class ControllersModule {}
