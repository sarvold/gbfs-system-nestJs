import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Observable, from, map, of, tap } from 'rxjs';
import { GBFSSystemDto } from './gbfs-system.interfaces';
import { GBFSSystemDocument } from './gbfs-system.schema';

@Injectable()
export class GBFSSystemService {
  // Native caching, for auto-discovery purposes only.
  private cache = new Map<string, string>(); // contains as keys the systemId and as values the autoDiscoveryUrl
  private cacheExpiration: Date;

  constructor(
    @InjectModel('GBFSSystemClass')
    private readonly gbfsSystemModel: Model<GBFSSystemDocument>,
  ) {}

  async getAllSystems(): Promise<GBFSSystemDto[]> {
    const systems = await this.gbfsSystemModel.find<GBFSSystemDto>().exec();
    if (!systems || systems.length === 0) {
      throw new NotFoundException('No systems found');
    }
    const now = new Date();
    systems.forEach((system) => {
      // Only update cache if expired, no sense to constantly update systems auto-discovery urls
      if (!this.cacheExpiration || now > this.cacheExpiration) {
        this.resetCacheExpiration(now);
        this.cache.set(system.systemId, system.autoDiscoveryUrl);
      }
    });

    return systems.map((system) => ({
      systemId: system.systemId,
      countryCode: system.countryCode,
      name: system.name,
      location: system.location,
      url: system.url,
      autoDiscoveryUrl: system.autoDiscoveryUrl,
      authenticationInfo: system.authenticationInfo,
    }));
  }

  getAutoDiscoveryUrl(systemId: string): Observable<string> {
    const now = new Date();
    if (this.cache.has(systemId) && now < this.cacheExpiration) {
      return of(this.cache.get(systemId));
    }
    return this.getSystemById(systemId).pipe(
      tap((system: GBFSSystemDto) => {
        if (system) {
          this.resetCacheExpiration(now);
          this.cache.set(system.systemId, system.autoDiscoveryUrl);
        } else {
          throw new NotFoundException(
            `System not found, systemId: ${systemId}`,
          );
        }
      }),
      map((system) => {
        return system.autoDiscoveryUrl;
      }),
    );
  }

  /**
   * Reset the cache only after it expires, so we refresh the data every hour
   * @param now
   */
  private resetCacheExpiration(now: Date) {
    if (now > this.cacheExpiration) {
      this.cacheExpiration = new Date();
      this.cacheExpiration.setHours(this.cacheExpiration.getHours() + 1);
    }
  }

  getSystemById(systemId: string): Observable<GBFSSystemDto> {
    return from(this.gbfsSystemModel.findOne({ systemId })).pipe(
      tap((system) => {
        if (!system) {
          throw new NotFoundException(`System with id ${systemId} not found`);
        }
      }),
    );
  }

  async createSystems(systems: GBFSSystemDto[]): Promise<GBFSSystemDto[]> {
    return this.gbfsSystemModel.insertMany(systems);
  }
}
