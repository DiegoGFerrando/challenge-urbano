import { forwardRef, Module } from '@nestjs/common';

import { CourseModule } from '../course/course.module';
import { EnrollmentService } from './enrollment.service';

@Module({
  imports: [forwardRef(() => CourseModule)],
  controllers: [],
  providers: [EnrollmentService],
  exports: [EnrollmentService],
})
export class SectionModule {}
