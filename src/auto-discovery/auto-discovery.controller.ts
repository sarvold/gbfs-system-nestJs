import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { Observable } from 'rxjs';
import { CustomCacheInterceptor } from 'src/interceptors/cache/cache.interceptor';
import { BaseResponse } from 'src/shared/interfaces/base-response.interface';
import {
  FullSystemDetails,
  GbfsDiscoveryFile,
} from './auto-discovery.interfaces';
import { AutoDiscoveryService } from './auto-discovery.service';

@Controller('auto-discovery')
export class AutoDiscoveryController {
  constructor(private readonly autoDiscoveryService: AutoDiscoveryService) {}

  @Get(':systemId/discovery-file')
  getDiscoveryFile(
    @Param('systemId') systemId: string,
  ): Observable<BaseResponse<GbfsDiscoveryFile>> {
    return this.autoDiscoveryService.getAutoDiscoveryFile(systemId);
  }

  @Get(':systemId')
  @UseInterceptors(CustomCacheInterceptor)
  getSystemDetails(
    @Param('systemId') systemId: string,
  ): Observable<FullSystemDetails> {
    return this.autoDiscoveryService.getSystemDetails(systemId);
  }
}
