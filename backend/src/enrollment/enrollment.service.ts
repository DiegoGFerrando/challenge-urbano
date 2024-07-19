import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FindManyOptions, ILike } from 'typeorm';

import { SectionService } from '../section/section.service';
import { UserService } from '../user/user.service';
import { CreateEnrollmentDto, FormattedEnrollmentDto } from './enrollment.dto';
import { Enrollment } from './enrollment.entity';
import { EnrollmentQuery } from './enrollment.query';

@Injectable()
export class EnrollmentService {
  constructor(
    private readonly sectionService: SectionService,
    private readonly userService: UserService,
  ) {}

  async save(
    sectionId: string,
    userid: string,
    createEnrollmentDto: CreateEnrollmentDto,
  ): Promise<Enrollment> {
    const { enrolled_at } = createEnrollmentDto;
    const section = await this.sectionService.findById(sectionId);
    const user = await this.userService.findById(userid);
    return await Enrollment.create({
      enrolled_at,
      section,
      user,
    }).save();
  }

  async findAll(enrollmentQuery: EnrollmentQuery): Promise<Enrollment[]> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'number',
      sortOrder = 'ASC',
      ...filters
    } = enrollmentQuery;

    const where = Object.keys(filters).reduce((acc, key) => {
      acc[key] = ILike(`%${filters[key]}%`);
      return acc;
    }, {});

    const options: FindManyOptions<Enrollment> = {
      where,
      order: {
        [sortBy]: sortOrder,
      },
      skip: (page - 1) * limit,
      take: limit,
    };

    return await Enrollment.find(options);
  }

  async findAllBySectionId(
    sectionId: string,
    enrollmentQuery: EnrollmentQuery,
  ): Promise<Enrollment[]> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'sectionId',
      sortOrder = 'ASC',
      ...filters
    } = enrollmentQuery;

    const where = Object.keys(filters).reduce((acc, key) => {
      acc[key] = ILike(`%${filters[key]}%`);
      return acc;
    }, {});

    const options: FindManyOptions<Enrollment> = {
      relations: ['section', 'section.course', 'user'],
      where: { sectionId, ...where },
      order: {
        [sortBy]: sortOrder,
      },
      skip: (page - 1) * limit,
      take: limit,
    };

    return await Enrollment.find(options);
  }

  async findAllByUserId(
    userId: string,
    enrollmentQuery: EnrollmentQuery,
  ): Promise<Enrollment[]> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'sectionId',
      sortOrder = 'ASC',
      ...filters
    } = enrollmentQuery;

    const where = Object.keys(filters).reduce((acc, key) => {
      acc[key] = ILike(`%${filters[key]}%`);
      return acc;
    }, {});

    const options: FindManyOptions<Enrollment> = {
      relations: ['section', 'section.course', 'user'],
      where: { userId, ...where },
      order: {
        [sortBy]: sortOrder,
      },
      skip: (page - 1) * limit,
      take: limit,
    };

    return await Enrollment.find(options);
  }

  async findBySectionIdAndUserId(
    sectionId: string,
    userId: string,
  ): Promise<Enrollment> {
    const enrollment = await Enrollment.findOne({ sectionId, userId });
    if (!enrollment) {
      throw new HttpException('Enrollment not found', HttpStatus.NOT_FOUND);
    }
    return enrollment;
  }

  async delete(sectionId: string, userId: string): Promise<string> {
    const enrollment = await this.findBySectionIdAndUserId(sectionId, userId);
    await Enrollment.delete(enrollment);
    return JSON.stringify({ sectionId, userId });
  }

  async count(): Promise<number> {
    return await Enrollment.count();
  }

  async formatEnrollment(
    enrollments: Enrollment[],
  ): Promise<FormattedEnrollmentDto[]> {
    return enrollments.map((enrollment) => {
      const { section, user, enrolled_at } = enrollment;

      const { course } = section;

      return {
        courseName: course.name,
        courseDescription: course.description,
        sectionNumber: section.number,
        sectionSchedule: section.schedule,
        userName: user.firstName + ' ' + user.lastName,
        enrolledAt: enrolled_at.toISOString(),
      };
    });
  }
}
