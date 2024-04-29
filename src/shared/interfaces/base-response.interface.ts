export interface BaseResponse<T> {
  last_updated: number;
  ttl: number;
  version: string;
  data: T;
}
