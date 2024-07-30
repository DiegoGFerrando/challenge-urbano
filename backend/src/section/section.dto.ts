import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateSectionDto {
  @IsNotEmpty()
  @IsInt()
  number: number;

  @IsNotEmpty()
  @IsString()
  schedule: string;

  @IsNotEmpty()
  @IsDateString()
  start_date: Date;

  @IsOptional()
  @IsDateString()
  end_date?: Date;
}

export class UpdateSectionDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  schedule?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsDateString()
  end_date?: Date;
}

export class FormattedSectionDto {
  course_id: string;
  course_name: string;
  course_description: string;
  section_number: number;
  section_schedule: string;
  section_start_date: string;
}
