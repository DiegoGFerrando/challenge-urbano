import { forwardRef, Module } from '@nestjs/common';

import { CourseModule } from '../course/course.module';
import { SectionService } from './section.service';

@Module({
  imports: [forwardRef(() => CourseModule)],
  controllers: [],
  providers: [SectionService],
  exports: [SectionService],
})
export class SectionModule {}
