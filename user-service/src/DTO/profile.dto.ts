import { IsString, IsBoolean, IsOptional, IsIn } from 'class-validator';

export class ProfileDTO {
  @IsString()
  @IsOptional()
  full_name?: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsIn(['0', '1'])
  @IsOptional()
  gender?: string;
}
