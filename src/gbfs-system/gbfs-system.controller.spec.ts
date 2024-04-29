import { Test, TestingModule } from '@nestjs/testing';
import { GBFSSystemController } from './gbfs-system.controller';
import { GBFSSystemService } from './gbfs-system.service';

describe('GBFSSystemController', () => {
  let controller: GBFSSystemController;
  let service: GBFSSystemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GBFSSystemController],
      providers: [
        {
          provide: GBFSSystemService,
          useValue: {
            getAllSystems: jest.fn().mockResolvedValue([]),
            createSystems: jest.fn().mockResolvedValue([]),
          },
        },
      ],
    }).compile();

    controller = module.get<GBFSSystemController>(GBFSSystemController);
    service = module.get<GBFSSystemService>(GBFSSystemService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get all systems', async () => {
    await controller.getAllSystems();
    expect(service.getAllSystems).toHaveBeenCalled();
  });

  it('should create systems', async () => {
    const systems = [
      {
        systemId: '1',
        countryCode: 'US',
        name: 'Test',
        location: 'Test Location',
        url: 'http://test.com',
        autoDiscoveryUrl: 'http://test.com',
      },
    ];
    await controller.createSystems(systems);
    expect(service.createSystems).toHaveBeenCalledWith(systems);
  });
});
