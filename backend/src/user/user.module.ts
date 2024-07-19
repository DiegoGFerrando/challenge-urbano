import { forwardRef, Module } from '@nestjs/common';
import { EnrollmentModule } from 'src/enrollment/enrollment.module';

import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [forwardRef(() => EnrollmentModule)],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
