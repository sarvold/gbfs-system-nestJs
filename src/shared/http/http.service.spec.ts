import { Test, TestingModule } from '@nestjs/testing';
import { UrbanSharingHttpService } from './http.service';

describe('HttpService', () => {
  let service: UrbanSharingHttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UrbanSharingHttpService],
    }).compile();

    service = module.get<UrbanSharingHttpService>(UrbanSharingHttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
