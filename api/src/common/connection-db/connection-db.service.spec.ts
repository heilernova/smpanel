import { Test, TestingModule } from '@nestjs/testing';
import { ConnectionDbService } from './connection-db.service';

describe('ConnectionDbService', () => {
  let service: ConnectionDbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConnectionDbService],
    }).compile();

    service = module.get<ConnectionDbService>(ConnectionDbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
