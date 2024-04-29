import { Module } from '@nestjs/common';
import { GbfsSystemModule } from 'src/gbfs-system/gbfs-system.module';
import { SharedModule } from 'src/shared/shared.module';
import { AutoDiscoveryController } from './auto-discovery.controller';
import { AutoDiscoveryService } from './auto-discovery.service';

@Module({
  controllers: [AutoDiscoveryController],
  providers: [AutoDiscoveryService],
  imports: [SharedModule, GbfsSystemModule],
})
export class AutoDiscoveryModule {}
