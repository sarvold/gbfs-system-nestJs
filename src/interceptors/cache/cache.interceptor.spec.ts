import { CallHandler, ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { FullSystemDetails } from 'src/auto-discovery/auto-discovery.interfaces';
import { CustomCacheInterceptor } from './cache.interceptor';

describe('CustomCacheInterceptor', () => {
  let interceptor: CustomCacheInterceptor;
  let executionContext: Partial<ExecutionContext>;
  let callHandler: CallHandler<FullSystemDetails>;
  let mockFullSystemDetailsResponse: FullSystemDetails;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomCacheInterceptor],
    }).compile();

    mockFullSystemDetailsResponse = {
      system_information: {
        last_updated: 0,
        ttl: 60,
        version: '2.3',
        data: {
          system_id: 'rydebergen',
          language: 'no',
          name: 'Ryde_Bergen',
          operator: 'Ryde',
          url: 'https://www.ryde-technology.com/',
          email: 'media@ryde-technology.com',
          timezone: 'Europe/Oslo',
        },
      },
      station_information: null,
      station_status: null,
    };
    interceptor = module.get<CustomCacheInterceptor>(CustomCacheInterceptor);
    executionContext = {
      switchToHttp: () => ({ getRequest: () => ({ url: 'testUrl' }) }),
    } as ExecutionContext;
    callHandler = {
      // handle: () => of({ station_status: { last_updated: 0, ttl: 60 } }),
      handle: () => of(mockFullSystemDetailsResponse),
    };
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  describe('intercept', () => {
    it('should return cached value if it exists and is not expired', (done) => {
      const cacheEntry = {
        value: 'testValue',
        expiry: Math.floor(Date.now() / 1000) + 60,
      };
      (interceptor as any).cache.set('testUrl', cacheEntry);

      interceptor.intercept(executionContext as ExecutionContext, callHandler).subscribe((data) => {
        expect(data).toEqual(cacheEntry.value);
        done();
      });
    });

    it('should call API and set cache if cache does not exist or is expired', (done) => {
      // This strategy has room for performance improvements. A basic one is not set the cache at all when ttl is 0.
      // Anyway if expiration added is already expired, next time api will be called.
      interceptor.intercept(executionContext as ExecutionContext, callHandler).subscribe((data) => {
        expect((interceptor as any).cache.get('testUrl').value).toEqual(
          data,
        );
        done();
      });
    });
  });
});
