import { HttpService as NestHttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { UrbanSharingHttpService } from './http.service';

describe('UrbanSharingHttpService', () => {
  let service: UrbanSharingHttpService;
  let httpService: NestHttpService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrbanSharingHttpService,
        { provide: NestHttpService, useValue: { get: jest.fn() } },
        { provide: ConfigService, useValue: { get: jest.fn() } },
      ],
    }).compile();

    service = module.get<UrbanSharingHttpService>(UrbanSharingHttpService);
    httpService = module.get<NestHttpService>(NestHttpService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('get', () => {
    it('should return the data from the response', (done) => {
      const url = 'http://test.com';
      const mockData = { key: 'value' };
      const response = { data: mockData };
      jest.spyOn(httpService, 'get').mockReturnValueOnce(of(response as any));
      jest
        .spyOn(configService, 'get')
        .mockReturnValueOnce('testClientIdentifier');

      service.get(url).subscribe((data) => {
        expect(data).toEqual(mockData);
        done();
      });
    });
  });
});
