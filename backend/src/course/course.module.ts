import { forwardRef, Module } from '@nestjs/common';
import { EnrollmentModule } from 'src/enrollment/enrollment.module';
import { SectionModule } from 'src/section/section.module';

import { ContentModule } from '../content/content.module';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';

@Module({
  imports: [
    forwardRef(() => ContentModule),
    forwardRef(() => SectionModule),
    forwardRef(() => EnrollmentModule),
  ],
  controllers: [CourseController],
  providers: [CourseService],
  exports: [CourseService],
})
export class CourseModule {}
