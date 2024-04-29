import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { GBFSSystemDto } from './gbfs-system.interfaces';
import { GBFSSystemService } from './gbfs-system.service';

describe('GBFSSystemService', () => {
  let service: GBFSSystemService;
  let model: any;
  let mockSystems: GBFSSystemDto[];

  beforeEach(async () => {
    model = {
      find: jest.fn(),
      findOne: jest.fn(),
      insertMany: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GBFSSystemService,
        { provide: getModelToken('GBFSSystemClass'), useValue: model },
      ],
    }).compile();

    service = module.get<GBFSSystemService>(GBFSSystemService);
    mockSystems = [
      {
        systemId: '1',
        countryCode: 'US',
        name: 'Test',
        location: 'Test Location',
        url: 'http://test.com',
        autoDiscoveryUrl: 'http://test.com',
      },
      {
        systemId: 'bike_buenosaires',
        countryCode: 'AR',
        name: 'Ecobici',
        location: 'Buenos Aires',
        url: 'https://www.buenosaires.gob.ar/ecobici',
        autoDiscoveryUrl:
          'https://buenosaires.publicbikesystem.net/ube/gbfs/v1/',
        authenticationInfo: null,
      },
    ];
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllSystems', () => {
    it('should return all systems', async () => {
      model.find.mockReturnValueOnce({
        exec: () => Promise.resolve(mockSystems),
      });

      expect(await service.getAllSystems()).toEqual(mockSystems);
    });
  });

  describe('getSystemById', () => {
    it('should return the system with the given id', (done) => {
      const systemId = 'testSystem';
      model.findOne.mockReturnValueOnce(Promise.resolve(mockSystems[1]));

      service.getSystemById(systemId).subscribe((system) => {
        expect(system).toEqual(mockSystems[1]);
        done();
      });
    });
  });

  describe('createSystems', () => {
    it('should create systems and return them', async () => {
      model.insertMany.mockReturnValueOnce(Promise.resolve(mockSystems));

      expect(await service.createSystems(mockSystems)).toEqual(mockSystems);
    });
  });
});
