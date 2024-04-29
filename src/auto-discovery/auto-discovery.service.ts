import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Observable, forkJoin, from, of } from 'rxjs';
import { catchError, mergeMap, switchMap } from 'rxjs/operators';
import { GBFSSystemService } from '../gbfs-system/gbfs-system.service';
import { UrbanSharingHttpService } from '../shared/http/http.service';
import { BaseResponse } from '../shared/interfaces/base-response.interface';
import {
  FullSystemDetails,
  GbfsDiscoveryFeed,
  GbfsDiscoveryFile,
  RelevantGbfsFeedsName,
  StationInformation,
  StationStatus,
  SystemInformation,
  isLanguageOrCountryFeeds,
} from './auto-discovery.interfaces';

@Injectable()
export class AutoDiscoveryService {
  private readonly logger = new Logger(AutoDiscoveryService.name);

  constructor(
    private httpService: UrbanSharingHttpService,
    private readonly gbfsSystemService: GBFSSystemService,
  ) {}
  getSystemInformation(
    url: string,
  ): Observable<BaseResponse<SystemInformation>> {
    return this.httpService.get<BaseResponse<SystemInformation>>(url);
  }
  getStationInformation(
    url: string,
  ): Observable<BaseResponse<StationInformation>> {
    return this.httpService.get<BaseResponse<StationInformation>>(url);
  }
  getStationStatus(url: string): Observable<BaseResponse<StationStatus>> {
    return this.httpService.get<BaseResponse<StationStatus>>(url);
  }

  getAutoDiscoveryFile(
    systemId: string,
  ): Observable<BaseResponse<GbfsDiscoveryFile>> {
    return from(this.gbfsSystemService.getAutoDiscoveryUrl(systemId)).pipe(
      switchMap((autoDiscoveryUrl) => {
        return this.httpService.get<BaseResponse<GbfsDiscoveryFile>>(
          autoDiscoveryUrl,
        );
      }),
      catchError((error) => {
        this.logger.error(
          `Failed to get system data for ${systemId}: ${error.message}`,
        );
        throw new InternalServerErrorException(
          `Failed to get system data for ${systemId}: ${error.message}`,
        );
      }),
    );
  }

  getSystemDetails(systemId: string): Observable<FullSystemDetails> {
    return this.getAutoDiscoveryFile(systemId).pipe(
      mergeMap((gbfsDiscoveryDataResponse: BaseResponse<GbfsDiscoveryFile>) => {
        const feedsUrls: Record<RelevantGbfsFeedsName, string | null> = {
          system_information: null,
          station_information: null,
          station_status: null,
        };

        let feeds: GbfsDiscoveryFeed[];
        const data = gbfsDiscoveryDataResponse.data;

        if (isLanguageOrCountryFeeds(data)) {
          const firstLanguageKey = Object.keys(data)[0];
          feeds = data[firstLanguageKey].feeds;
        } else {
          feeds = data.feeds;
        }
        for (const feed of feeds) {
          if (feedsUrls.hasOwnProperty(feed.name)) {
            feedsUrls[feed.name] = feed.url;
          }
        }

        const systemInformation$ = feedsUrls.system_information
          ? this.getSystemInformation(feedsUrls.system_information)
          : of(null);
        const stationInformation$ = feedsUrls.station_information
          ? this.getStationInformation(feedsUrls.station_information)
          : of(null);
        const stationStatus$ = feedsUrls.station_status
          ? this.getStationStatus(feedsUrls.station_status)
          : of(null);

        return forkJoin({
          system_information: systemInformation$,
          station_information: stationInformation$,
          station_status: stationStatus$,
        });
      }),
    );
  }
}
