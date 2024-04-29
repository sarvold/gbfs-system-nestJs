export interface BaseResponse<T> {
  last_updated: number; // Represents Date in seconds
  ttl: number;
  version: string;
  data: T;
}
