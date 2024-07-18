import { IsDate, IsNotEmpty } from 'class-validator';

export class CreateEnrollmentDto {
  @IsNotEmpty()
  @IsDate()
  enrolled_at: Date;
}
