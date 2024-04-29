import { Test, TestingModule } from '@nestjs/testing';
import { AutoDiscoveryController } from './auto-discovery.controller';

describe('AutoDiscoveryController', () => {
  let controller: AutoDiscoveryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AutoDiscoveryController],
    }).compile();

    controller = module.get<AutoDiscoveryController>(AutoDiscoveryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
