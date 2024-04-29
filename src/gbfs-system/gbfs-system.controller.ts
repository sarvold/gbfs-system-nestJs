import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { CreateGBFSSystemsDto, GBFSSystemDto } from './gbfs-system.interfaces';
import { GBFSSystemService } from './gbfs-system.service';

@Controller('gbfs-system')
export class GBFSSystemController {
  constructor(private readonly gbfsSystemService: GBFSSystemService) {}

  @Get()
  async getAllSystems(): Promise<GBFSSystemDto[]> {
    return await this.gbfsSystemService.getAllSystems();
  }

  @Get(':systemId')
  getSystemById(
    @Param('systemId') systemId: string,
  ): Observable<GBFSSystemDto> {
    return this.gbfsSystemService.getSystemById(systemId);
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async createSystems(
    @Body() systems: CreateGBFSSystemsDto['systems'],
  ): Promise<GBFSSystemDto[]> {
    return this.gbfsSystemService.createSystems(systems);
  }
}
