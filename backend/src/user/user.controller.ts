import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FormattedEnrollmentDto } from 'src/enrollment/enrollment.dto';
import { Enrollment } from 'src/enrollment/enrollment.entity';
import { EnrollmentModule } from 'src/enrollment/enrollment.module';
import { EnrollmentQuery } from 'src/enrollment/enrollment.query';
import { EnrollmentService } from 'src/enrollment/enrollment.service';

import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserGuard } from '../auth/guards/user.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { User } from './user.entity';
import { UserQuery } from './user.query';
import { UserService } from './user.service';

@Controller('users')
@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtGuard, RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly enrollmentService: EnrollmentService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.Admin)
  async save(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.save(createUserDto);
  }

  @Get()
  @Roles(Role.Admin)
  async findAll(@Query() userQuery: UserQuery): Promise<User[]> {
    return await this.userService.findAll(userQuery);
  }

  @Get('/:id')
  @UseGuards(UserGuard)
  async findOne(@Param('id') id: string): Promise<User> {
    return await this.userService.findById(id);
  }

  @Put('/:id')
  @UseGuards(UserGuard)
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.userService.update(id, updateUserDto);
  }

  @Delete('/:id')
  @Roles(Role.Admin)
  async delete(@Param('id') id: string): Promise<string> {
    return await this.userService.delete(id);
  }

  @Get('/:id/enrollments')
  @Roles(Role.Admin, Role.Editor)
  async findEnrollments(
    @Param('id') userId: string,
    @Query() enrollmentQuery: EnrollmentQuery,
  ): Promise<FormattedEnrollmentDto[]> {
    const enrollmentData = await this.enrollmentService.findAllByUserId(
      userId,
      enrollmentQuery,
    );
    return await this.enrollmentService.formatEnrollment(enrollmentData);
  }
}
