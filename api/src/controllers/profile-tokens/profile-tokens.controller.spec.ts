import { Test, TestingModule } from '@nestjs/testing';
import { ProfileTokensController } from './profile-tokens.controller';

describe('ProfileTokensController', () => {
  let controller: ProfileTokensController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileTokensController],
    }).compile();

    controller = module.get<ProfileTokensController>(ProfileTokensController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
