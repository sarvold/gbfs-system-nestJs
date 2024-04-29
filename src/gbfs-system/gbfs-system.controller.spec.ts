import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { GBFSSystemController } from './gbfs-system.controller';
import { GBFSSystemDto } from './gbfs-system.interfaces';
import { GBFSSystemService } from './gbfs-system.service';

describe('GBFSSystemController', () => {
  let controller: GBFSSystemController;
  let service: GBFSSystemService;
  let mockSystems: GBFSSystemDto[];
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GBFSSystemController],
      providers: [
        {
          provide: GBFSSystemService,
          useValue: {
            getAllSystems: jest.fn(),
            getSystemById: jest.fn(),
            createSystems: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<GBFSSystemController>(GBFSSystemController);
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
    expect(controller).toBeDefined();
  });

  describe('getAllSystems', () => {
    it('should return all systems', async () => {
      jest
        .spyOn(service, 'getAllSystems')
        .mockReturnValueOnce(Promise.resolve(mockSystems));

      expect(await controller.getAllSystems()).toEqual(mockSystems);
    });
  });

  describe('getSystemById', () => {
    it('should return the system with the given id', (done) => {
      const systemId = 'testSystem';
      jest
        .spyOn(service, 'getSystemById')
        .mockReturnValueOnce(of(mockSystems[1]));

      controller.getSystemById(systemId).subscribe((system) => {
        expect(system).toEqual(mockSystems[1]);
        done();
      });
    });
  });

  describe('createSystems', () => {
    it('should create systems and return them', async () => {
      jest
        .spyOn(service, 'createSystems')
        .mockReturnValueOnce(Promise.resolve(mockSystems));

      expect(await controller.createSystems(mockSystems)).toEqual(mockSystems);
    });
  });
});
