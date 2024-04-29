import { HttpService as NestHttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { Observable, map } from 'rxjs';

@Injectable()
export class UrbanSharingHttpService {
  constructor(
    private readonly httpService: NestHttpService,
    private readonly configService: ConfigService,
  ) {}

  get<T>(url: string): Observable<T> {
    return this.httpService
      .get<T>(url, {
        headers: {
          'Client-Identifier':
            this.configService.get<string>('CLIENT_IDENTIFIER'),
        },
      })
      .pipe(
        map((response: AxiosResponse<T>) => {
          return response.data;
        }),
      );
  }
}
