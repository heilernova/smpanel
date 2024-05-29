import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { ApplicationsController } from './applications/applications.controller';

@Module({
  controllers: [AuthController, ApplicationsController]
})
export class ControllersModule {}
