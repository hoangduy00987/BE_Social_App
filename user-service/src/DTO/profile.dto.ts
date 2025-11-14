
import {IsString, IsBoolean, IsOptional } from 'class-validator';


export class ProfileDTO {
  @IsString()
  @IsOptional()
  full_name?: string;

  @IsBoolean()
  @IsOptional()
  avatar?: boolean;

  @IsBoolean()
  @IsOptional()
  gender?: boolean;
}