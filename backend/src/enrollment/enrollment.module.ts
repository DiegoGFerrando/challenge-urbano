import { forwardRef, Module } from '@nestjs/common';

import { SectionModule } from '../section/section.module';
import { UserModule } from '../user/user.module';
import { EnrollmentService } from './enrollment.service';

@Module({
  imports: [forwardRef(() => SectionModule), forwardRef(() => UserModule)],
  controllers: [],
  providers: [EnrollmentService],
  exports: [EnrollmentService],
})
export class EnrollmentModule {}
