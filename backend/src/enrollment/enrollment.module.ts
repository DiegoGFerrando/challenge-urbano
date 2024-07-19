import { forwardRef, Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';

import { CourseModule } from '../course/course.module';
import { SectionModule } from '../section/section.module';
import { EnrollmentService } from './enrollment.service';

@Module({
  imports: [forwardRef(() => CourseModule), SectionModule, UserModule],
  controllers: [],
  providers: [EnrollmentService],
  exports: [EnrollmentService],
})
export class EnrollmentModule {}
