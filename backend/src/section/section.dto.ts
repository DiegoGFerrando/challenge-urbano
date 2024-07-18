import { IsString, IsNotEmpty, IsOptional, IsInt, IsDate } from 'class-validator';

export class CreateSectionDto {
  @IsNotEmpty()
  @IsInt()
  number: number;

  @IsNotEmpty()
  @IsString()
  schedule: string;

  @IsNotEmpty()
  @IsDate()
  start_date: Date;

  @IsOptional()
  @IsDate()
  end_date?: Date;
}

export class UpdateSectionDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  schedule?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsDate()
  end_date?: Date;
}