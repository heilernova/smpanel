import { Test, TestingModule } from '@nestjs/testing';
import { CliApplicationsController } from './cli-applications.controller';

describe('CliApplicationsController', () => {
  let controller: CliApplicationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CliApplicationsController],
    }).compile();

    controller = module.get<CliApplicationsController>(CliApplicationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
