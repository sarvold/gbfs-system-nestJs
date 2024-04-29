import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { BaseResponse } from '../shared/interfaces/base-response.interface';
import { AutoDiscoveryController } from './auto-discovery.controller';
import { GbfsDiscoveryFile } from './auto-discovery.interfaces';
import { AutoDiscoveryService } from './auto-discovery.service';

describe('AutoDiscoveryController', () => {
  let controller: AutoDiscoveryController;
  let service: AutoDiscoveryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AutoDiscoveryController],
      providers: [
        {
          provide: AutoDiscoveryService,
          useValue: {
            getAutoDiscoveryFile: jest.fn(),
            getSystemDetails: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AutoDiscoveryController>(AutoDiscoveryController);
    service = module.get<AutoDiscoveryService>(AutoDiscoveryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getDiscoveryFile', () => {
    it('should return the auto discovery file for a given system', (done) => {
      const systemId = 'testSystem';
      const mockResponse = { data: { feeds: [] } };

      jest
        .spyOn(service, 'getAutoDiscoveryFile')
        .mockReturnValueOnce(
          of(mockResponse as BaseResponse<GbfsDiscoveryFile>),
        );

      controller.getDiscoveryFile(systemId).subscribe((response) => {
        expect(response).toEqual(mockResponse);
        done();
      });
    });
  });

  describe('getSystemDetails', () => {
    it('should return the full system details for a given system', (done) => {
      const systemId = 'testSystem';
      const mockDetails = {
        system_information: null,
        station_information: null,
        station_status: null,
      };

      jest
        .spyOn(service, 'getSystemDetails')
        .mockReturnValueOnce(of(mockDetails));

      controller.getSystemDetails(systemId).subscribe((details) => {
        expect(details).toEqual(mockDetails);
        done();
      });
    });
  });
});
