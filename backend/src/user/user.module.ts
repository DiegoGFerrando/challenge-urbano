import { forwardRef, Module } from '@nestjs/common';
import { EnrollmentModule } from 'src/enrollment/enrollment.module';
import { SectionModule } from 'src/section/section.module';

import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    forwardRef(() => EnrollmentModule),
    forwardRef(() => SectionModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
