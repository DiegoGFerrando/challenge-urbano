import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateEnrollmentDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  sectionId: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsDateString()
  enrolled_at: Date;
}

export class FormattedEnrollmentDto {
  courseName: string;
  courseDescription: string;
  sectionNumber: number;
  sectionSchedule: string;
  userName: string;
  enrolledAt: string;
}
