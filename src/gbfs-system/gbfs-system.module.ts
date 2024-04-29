import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared/shared.module';
import { GBFSSystemController } from './gbfs-system.controller';
import { GBFSSystemService } from './gbfs-system.service';

@Module({
  providers: [GBFSSystemService],
  controllers: [GBFSSystemController],
  imports: [SharedModule],
  exports: [GBFSSystemService],
})
export class GbfsSystemModule {}
