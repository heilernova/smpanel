import { Test, TestingModule } from '@nestjs/testing';
import { CliDeployController } from './cli-deploy.controller';

describe('CliDeployController', () => {
  let controller: CliDeployController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CliDeployController],
    }).compile();

    controller = module.get<CliDeployController>(CliDeployController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
