import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateEnrollmentDto } from 'src/enrollment/enrollment.dto';
import { Enrollment } from 'src/enrollment/enrollment.entity';
import { EnrollmentQuery } from 'src/enrollment/enrollment.query';
import { EnrollmentService } from 'src/enrollment/enrollment.service';

import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateContentDto, UpdateContentDto } from '../content/content.dto';
import { Content } from '../content/content.entity';
import { ContentQuery } from '../content/content.query';
import { ContentService } from '../content/content.service';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';
import { CreateSectionDto, UpdateSectionDto } from '../section/section.dto';
import { Section } from '../section/section.entity';
import { SectionQuery } from '../section/section.query';
import { SectionService } from '../section/section.service';
import { CreateCourseDto, UpdateCourseDto } from './course.dto';
import { Course } from './course.entity';
import { CourseQuery } from './course.query';
import { CourseService } from './course.service';

@Controller('courses')
@ApiBearerAuth()
@UseGuards(JwtGuard, RolesGuard)
@ApiTags('Courses')
export class CourseController {
  constructor(
    private readonly courseService: CourseService,
    private readonly contentService: ContentService,
    private readonly sectionService: SectionService,
    private readonly enrollmentService: EnrollmentService,
  ) {}

  @Post()
  @Roles(Role.Admin, Role.Editor)
  async save(@Body() createCourseDto: CreateCourseDto): Promise<Course> {
    return await this.courseService.save(createCourseDto);
  }

  @Get()
  async findAll(@Query() courseQuery: CourseQuery): Promise<Course[]> {
    return await this.courseService.findAll(courseQuery);
  }

  @Get('/:id')
  async findOne(@Param('id') id: string): Promise<Course> {
    return await this.courseService.findById(id);
  }

  @Put('/:id')
  @Roles(Role.Admin, Role.Editor)
  async update(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ): Promise<Course> {
    return await this.courseService.update(id, updateCourseDto);
  }

  @Delete('/:id')
  @Roles(Role.Admin)
  async delete(@Param('id') id: string): Promise<string> {
    return await this.courseService.delete(id);
  }

  @Post('/:id/contents')
  @Roles(Role.Admin, Role.Editor)
  async saveContent(
    @Param('id') id: string,
    @Body() createContentDto: CreateContentDto,
  ): Promise<Content> {
    return await this.contentService.save(id, createContentDto);
  }

  @Get('/:id/contents')
  async findAllContentsByCourseId(
    @Param('id') id: string,
    @Query() contentQuery: ContentQuery,
  ): Promise<Content[]> {
    return await this.contentService.findAllByCourseId(id, contentQuery);
  }

  @Put('/:id/contents/:contentId')
  @Roles(Role.Admin, Role.Editor)
  async updateContent(
    @Param('id') id: string,
    @Param('contentId') contentId: string,
    @Body() updateContentDto: UpdateContentDto,
  ): Promise<Content> {
    return await this.contentService.update(id, contentId, updateContentDto);
  }

  @Delete('/:id/contents/:contentId')
  @Roles(Role.Admin)
  async deleteContent(
    @Param('id') id: string,
    @Param('contentId') contentId: string,
  ): Promise<string> {
    return await this.contentService.delete(id, contentId);
  }

  @Post('/:id/sections')
  @Roles(Role.Admin, Role.Editor)
  async saveSection(
    @Param('id') id: string,
    @Body() createSectionDto: CreateSectionDto,
  ): Promise<Section> {
    return await this.sectionService.save(id, createSectionDto);
  }

  @Get('/:id/sections')
  async findAllSectionsByCourseId(
    @Param('id') id: string,
    @Query() sectionQuery: SectionQuery,
  ): Promise<Section[]> {
    return await this.sectionService.findAllByCourseId(id, sectionQuery);
  }

  @Put('/:id/sections/:sectionId')
  @Roles(Role.Admin, Role.Editor)
  async updateSection(
    @Param('id') id: string,
    @Param('sectionId') sectionId: string,
    @Body() updateSectionDto: UpdateSectionDto,
  ): Promise<Section> {
    return await this.sectionService.update(id, sectionId, updateSectionDto);
  }

  @Delete('/:id/sections/:sectionId')
  @Roles(Role.Admin)
  async deleteSection(
    @Param('id') id: string,
    @Param('sectionId') sectionId: string,
  ): Promise<string> {
    return await this.sectionService.delete(id, sectionId);
  }

  @Post('/:id/sections/:sectionId/enrollments')
  @Roles(Role.Admin, Role.Editor)
  async saveEnrollment(
    @Param('sectionId') sectionId: string,
    @Body('userId') userId: string,
    @Body() createEnrollmentDto: CreateEnrollmentDto,
  ): Promise<Enrollment> {
    return await this.enrollmentService.save(
      sectionId,
      userId,
      createEnrollmentDto,
    );
  }

  @Get('/:id/sections/:sectionId/enrollments')
  @Roles(Role.Admin, Role.Editor)
  async findAllEnrollmentsBySectionId(
    @Param('sectionId') sectionId: string,
    @Query() enrollmentQuery: EnrollmentQuery,
  ): Promise<Enrollment[]> {
    return await this.enrollmentService.findAllBySectionId(
      sectionId,
      enrollmentQuery,
    );
  }

  @Delete('/:id/sections/:sectionId/enrollments')
  @Roles(Role.Admin)
  async deleteEnrollment(
    @Param('sectionId') sectionId: string,
    @Param('userId') userId: string,
  ): Promise<string> {
    return await this.enrollmentService.delete(sectionId, userId);
  }
}
