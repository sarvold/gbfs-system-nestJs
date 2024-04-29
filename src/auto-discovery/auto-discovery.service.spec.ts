import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';

import { GBFSSystemService } from '../gbfs-system/gbfs-system.service';
import { UrbanSharingHttpService } from '../shared/http/http.service';
import { BaseResponse } from '../shared/interfaces/base-response.interface';
import { GbfsDiscoveryFile } from './auto-discovery.interfaces';
import { AutoDiscoveryService } from './auto-discovery.service';

describe('AutoDiscoveryService', () => {
  let service: AutoDiscoveryService;
  let httpService: UrbanSharingHttpService;
  let gbfsSystemService: GBFSSystemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AutoDiscoveryService,
        { provide: UrbanSharingHttpService, useValue: { get: jest.fn() } },
        {
          provide: GBFSSystemService,
          useValue: { getAutoDiscoveryUrl: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<AutoDiscoveryService>(AutoDiscoveryService);
    httpService = module.get<UrbanSharingHttpService>(UrbanSharingHttpService);
    gbfsSystemService = module.get<GBFSSystemService>(GBFSSystemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAutoDiscoveryFile', () => {
    it('should return the auto discovery file for a given system', (done) => {
      const systemId = 'testSystem';
      const autoDiscoveryUrl = 'http://example.com/gbfs.json';
      const mockResponse = { data: { feeds: [] } };

      jest
        .spyOn(gbfsSystemService, 'getAutoDiscoveryUrl')
        .mockReturnValueOnce(of(autoDiscoveryUrl));
      jest.spyOn(httpService, 'get').mockReturnValueOnce(of(mockResponse));

      service.getAutoDiscoveryFile(systemId).subscribe((response) => {
        expect(response).toEqual(mockResponse);
        done();
      });
    });
  });

  describe('getSystemDetails', () => {
    it('should return the full system details for a given system', (done) => {
      const systemId = 'testSystem';
      const mockResponse = { data: { feeds: [] } };
      const mockDetails = {
        system_information: null,
        station_information: null,
        station_status: null,
      };

      jest
        .spyOn(service, 'getAutoDiscoveryFile')
        .mockReturnValueOnce(
          of(mockResponse as BaseResponse<GbfsDiscoveryFile>),
        );

      service.getSystemDetails(systemId).subscribe((details) => {
        expect(details).toEqual(mockDetails);
        done();
      });
    });
  });
});
