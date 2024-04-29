import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsNotEmpty, IsOptional, IsString, IsUrl, ValidateNested } from 'class-validator';
import { BaseResponse } from 'src/shared/interfaces/base-response.interface';

export class GBFSSystemDto {
  @IsNotEmpty()
  @IsString()
  countryCode: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  @IsString()
  systemId: string;

  @IsNotEmpty()
  @IsUrl()
  url: string;

  @IsNotEmpty()
  @IsUrl()
  autoDiscoveryUrl: string;

  @IsOptional()
  @IsString()
  authenticationInfo?: string;
}


export class CreateGBFSSystemsDto {
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => GBFSSystemDto)
  systems: GBFSSystemDto[];
}

export type GBFSSystemResponse = BaseResponse<GBFSSystemDto>;
