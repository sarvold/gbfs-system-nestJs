import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { GBFSSystemClass } from './gbfs-system.schema';
import { GBFSSystemService } from './gbfs-system.service';

describe('GBFSSystemService', () => {
  let service: GBFSSystemService;

  const mockModel = {
    find: jest.fn().mockReturnThis(),
    exec: jest.fn(),
    insertMany: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GBFSSystemService,
        {
          provide: getModelToken(GBFSSystemClass.name),
          useValue: mockModel,
        },
      ],
    }).compile();

    service = module.get<GBFSSystemService>(GBFSSystemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get all systems', async () => {
    mockModel.exec.mockResolvedValueOnce([]);
    await service.getAllSystems();
    expect(mockModel.find).toHaveBeenCalled();
    expect(mockModel.exec).toHaveBeenCalled();
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
    await service.createSystems(systems);
    expect(mockModel.insertMany).toHaveBeenCalledWith(systems);
  });
});
