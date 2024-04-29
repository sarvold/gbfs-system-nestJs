import { CallHandler, ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { CustomCacheInterceptor } from './cache.interceptor';

describe('CustomCacheInterceptor', () => {
  let interceptor: CustomCacheInterceptor;
  let executionContext: ExecutionContext;
  let callHandler: CallHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomCacheInterceptor],
    }).compile();

    interceptor = module.get<CustomCacheInterceptor>(CustomCacheInterceptor);
    executionContext = {
      switchToHttp: () => ({ getRequest: () => ({ url: 'testUrl' }) }),
    } as any;
    callHandler = {
      handle: () => of({ station_status: { last_updated: 0, ttl: 60 } }),
    } as any;
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

      interceptor.intercept(executionContext, callHandler).subscribe((data) => {
        expect(data.data).toEqual(cacheEntry.value);
        done();
      });
    });

    it('should call API and set cache if cache does not exist or is expired', (done) => {
      interceptor.intercept(executionContext, callHandler).subscribe((data) => {
        expect((interceptor as any).cache.get('testUrl').value).toEqual(data);
        done();
      });
    });
  });
});
