import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CustomCacheInterceptor } from 'src/interceptors/cache/cache.interceptor';
import { DatabaseModule } from './database/database.module';
import { UrbanSharingHttpService } from './http/http.service';

@Module({
  providers: [
    UrbanSharingHttpService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CustomCacheInterceptor,
    },
  ],
  exports: [
    UrbanSharingHttpService,
    DatabaseModule,
    ConfigModule,
  ],
  imports: [DatabaseModule, ConfigModule, HttpModule],
})
export class SharedModule {}
