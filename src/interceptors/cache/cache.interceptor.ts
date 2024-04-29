import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FullSystemDetails } from 'src/auto-discovery/auto-discovery.interfaces';

interface CacheEntry {
  value: FullSystemDetails;
  expiry: number;
}

@Injectable()
export class CustomCacheInterceptor implements NestInterceptor {
  // Native caching. CacheModule from @nestjs/cache-manager does not seem to have the flexibility we need here.
  // Alternatively, we could use redis or memcached for production
  private cache = new Map<string, CacheEntry>(); // We use as keys the request Url

  intercept(
    context: ExecutionContext,
    next: CallHandler<FullSystemDetails>,
  ): Observable<any> {
    const key: string = context.switchToHttp().getRequest().url;

    console.log('CustomCacheInterceptor');
    console.log('Request element --> key: ', key);
    console.log('cache: ', this.cache);
    // Nothing to find or set in cache
    if (!key) {
      return next.handle();
    }

    const cacheEntry = this.cache.get(key);
    const currentTime = Math.floor(Date.now() / 1000); // Convert to seconds

    // If the cache entry exists and it's not expired, return it
    if (cacheEntry && currentTime < cacheEntry.expiry) {
      return of({
        ttl: cacheEntry.expiry - currentTime,
        last_updated: cacheEntry.expiry,
        data: cacheEntry.value,
      });
    }

    // Continue flow, call API and set cache
    return next.handle().pipe(
      tap((response: FullSystemDetails) => {
        console.log('response: ', response);
        this.cache.set(key, {
          value: response,
          expiry:
            // Assuming station_status might have fastest changing values
            response.station_status.last_updated + response.station_status.ttl,
        });
      }),
    );
  }
}
