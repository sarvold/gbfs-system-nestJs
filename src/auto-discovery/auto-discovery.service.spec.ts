import { Test, TestingModule } from '@nestjs/testing';
import { AutoDiscoveryService } from './auto-discovery.service';

describe('AutoDiscoveryService', () => {
  let service: AutoDiscoveryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AutoDiscoveryService],
    }).compile();

    service = module.get<AutoDiscoveryService>(AutoDiscoveryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
