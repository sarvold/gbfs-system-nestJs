import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AutoDiscoveryModule } from './auto-discovery/auto-discovery.module';
import { GbfsSystemModule } from './gbfs-system/gbfs-system.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    GbfsSystemModule,
    SharedModule,
    ConfigModule.forRoot(),
    AutoDiscoveryModule,
  ],
})
export class AppModule {}
