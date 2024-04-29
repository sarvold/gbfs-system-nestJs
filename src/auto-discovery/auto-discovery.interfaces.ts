import { BaseResponse } from 'src/shared/interfaces/base-response.interface';
import { FEED_NAME } from './auto-discovery.constants';

export type GbfsFeedsName =
  | 'system_information'
  | 'station_information'
  | 'vehicle_types'
  | 'station_status'
  | 'vehicle_status'
  | 'system_regions'
  | 'system_pricing_plans'
  | 'system_alerts'
  | 'geofencing_zones';

export type RelevantGbfsFeedsName = (typeof FEED_NAME)[keyof typeof FEED_NAME];

export interface GbfsDiscoveryFeed {
  name: GbfsFeedsName;
  url: string;
}

/**
 * Example of a GBFS discovery file, contains a language or country key with the array of feeds
 *
 * {
 *   "last_updated": 1714158586,
 *   "ttl": 0,
 *   "version": "2.3",
 *   "data": {
 *       "no": {
 *           "feeds": [
 *               {
 *                   "name": "system_information",
 *                   "url": "https://api.entur.io/mobility/v2/gbfs/rydebergen/system_information"
 *               },
 *               {
 *                   "name": "free_bike_status",
 *                   "url": "https://api.entur.io/mobility/v2/gbfs/rydebergen/free_bike_status"
 *               },
 *               {
 *                   "name": "vehicle_types",
 *                   "url": "https://api.entur.io/mobility/v2/gbfs/rydebergen/vehicle_types"
 *               },
 *               {
 *                   "name": "system_pricing_plans",
 *                   "url": "https://api.entur.io/mobility/v2/gbfs/rydebergen/system_pricing_plans"
 *               }
 *           ]
 *       }
 *   }
 * }
 * However, in documentation it states directly feeds, no language nor country prefix.
 */
export type GbfsDiscoveryFile =
  | LanguageOrCountryFeeds<GbfsDiscoveryFeed[]>
  | { feeds: GbfsDiscoveryFeed[] };

interface LanguageOrCountryFeeds<T> {
  [key: string]: {
    feeds: T;
  };
}

export function isLanguageOrCountryFeeds(
  discoveryFile: GbfsDiscoveryFile,
): discoveryFile is LanguageOrCountryFeeds<GbfsDiscoveryFeed[]> {
  const firstValue = Object.values(discoveryFile)[0];
  return (
    typeof firstValue === 'object' &&
    firstValue !== null &&
    firstValue.hasOwnProperty('feeds') &&
    firstValue.feeds instanceof Array &&
    firstValue.feeds[0]?.hasOwnProperty('name') &&
    firstValue.feeds[0]?.hasOwnProperty('url')
  );
}

type StationInformationRentalMethods =
  | 'KEY'
  | 'CREDITCARD'
  | 'PAYPASS'
  | 'APPLEPAY'
  | 'ANDROIDPAY'
  | 'TRANSITCARD'
  | 'ACCOUNTNUMBER'
  | 'PHONE';

// station_information
export interface StationInformation {
  station_id: string;
  name: string;
  short_name?: string;
  lat: number;
  lon: number;
  address?: string;
  cross_street?: string;
  region_id?: string;
  post_code?: string;
  rental_methods?: StationInformationRentalMethods[];
  capacity?: number;
}

// station_status
export interface StationStatus {
  station_id: string;
  num_bikes_available: number;
  num_bikes_disabled?: number;
  num_docks_available: number;
  num_docks_disabled?: number;
  is_installed: number;
  is_renting: number;
  is_returning: number;
  last_reported: number;
}

// system_information
export interface SystemInformation {
  system_id: string;
  language: string;
  name: string;
  short_name?: string;
  operator?: string;
  url?: string;
  purchase_url?: string;
  start_date?: string;
  phone_number?: string;
  email?: string;
  timezone: string;
  license_url?: string;
}

export interface FullSystemDetails {
  system_information: BaseResponse<SystemInformation> | null;
  station_information: BaseResponse<StationInformation> | null;
  station_status: BaseResponse<StationStatus> | null;
}
