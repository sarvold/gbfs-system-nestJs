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
  ): Observable<FullSystemDetails> {
    const key: string = context.switchToHttp().getRequest().url;

    // Nothing to find or set in cache
    if (!key) {
      return next.handle();
    }

    const cacheEntry = this.cache.get(key);
    const currentTime = Math.floor(Date.now() / 1000); // Convert to seconds

    // If the cache entry exists and it's not expired, return it
    if (cacheEntry && currentTime < cacheEntry.expiry) {
      return of(cacheEntry.value);
    }

    // Continue flow, call API and set cache
    return next.handle().pipe(
      tap((response: Readonly<FullSystemDetails>) => {
        // Consider only those response elements that are truthy
        const soonestExpiry = Math.min(
          ...(response.station_status
            ? [
                response.station_status.last_updated +
                  response.station_status.ttl,
              ]
            : []),
          ...(response.station_information
            ? [
                response.station_information.last_updated +
                  response.station_information.ttl,
              ]
            : []),
          ...(response.system_information
            ? [
                response.system_information.last_updated +
                  response.system_information.ttl,
              ]
            : []),
        );
        this.cache.set(key, {
          value: response,
          expiry: soonestExpiry,
        });
      }),
    );
  }
}
