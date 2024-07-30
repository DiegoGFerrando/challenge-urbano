import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { FindManyOptions, ILike } from 'typeorm';

import { CourseService } from '../course/course.service';
import { EnrollmentService } from '../enrollment/enrollment.service';
import {
  CreateSectionDto,
  FormattedSectionDto,
  UpdateSectionDto,
} from './section.dto';
import { Section } from './section.entity';
import { SectionQuery } from './section.query';

@Injectable()
export class SectionService {
  constructor(
    @Inject(forwardRef(() => CourseService))
    private readonly courseService: CourseService,
    @Inject(forwardRef(() => EnrollmentService))
    private readonly enrollmentService: EnrollmentService,
  ) {}

  async save(
    courseId: string,
    createSectionDto: CreateSectionDto,
  ): Promise<Section> {
    const { number, schedule, start_date, end_date } = createSectionDto;
    const course = await this.courseService.findById(courseId);
    return await Section.create({
      number,
      schedule,
      start_date,
      end_date,
      course,
    }).save();
  }

  async findAll(sectionQuery: SectionQuery): Promise<Section[]> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'number',
      sortOrder = 'ASC',
      ...filters
    } = sectionQuery;

    const where = Object.keys(filters).reduce((acc, key) => {
      acc[key] = ILike(`%${filters[key]}%`);
      return acc;
    }, {});

    const options: FindManyOptions<Section> = {
      where,
      order: {
        [sortBy]: sortOrder,
      },
      skip: (page - 1) * limit,
      take: limit,
    };

    return await Section.find(options);
  }

  async findById(id: string): Promise<Section> {
    const section = await Section.findOne(id);

    if (!section) {
      throw new HttpException(
        `Could not find section with matching id ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }

    return section;
  }

  async findByCourseIdAndId(courseId: string, id: string): Promise<Section> {
    const section = await Section.findOne({ where: { courseId, id } });
    if (!section) {
      throw new HttpException(
        `Could not find section with matching id ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }
    return section;
  }

  async findAllByCourseId(
    courseId: string,
    sectionQuery: SectionQuery,
  ): Promise<Section[]> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'number',
      sortOrder = 'ASC',
      ...filters
    } = sectionQuery;

    const where = Object.keys(filters).reduce((acc, key) => {
      acc[key] = ILike(`%${filters[key]}%`);
      return acc;
    }, {});

    const options: FindManyOptions<Section> = {
      where: { courseId, ...where },
      order: {
        [sortBy]: sortOrder,
      },
      skip: (page - 1) * limit,
      take: limit,
    };

    return await Section.find(options);
  }

  async update(
    courseId: string,
    id: string,
    updateSectionDto: UpdateSectionDto,
  ): Promise<Section> {
    const section = await this.findByCourseIdAndId(courseId, id);
    return await Section.create({ id: section.id, ...updateSectionDto }).save();
  }

  async delete(courseId: string, id: string): Promise<string> {
    const section = await this.findByCourseIdAndId(courseId, id);
    await Section.delete(section);
    return id;
  }

  async count(): Promise<number> {
    return await Section.count();
  }

  async findAvailableSectionsForUser(
    userId: string,
  ): Promise<FormattedSectionDto[]> {
    try {
      const currentDate = new Date();
      const enrollmentQuery = {}; // Define the enrollmentQuery variable

      const enrolledCourses = await this.enrollmentService.findAllByUserId(
        userId,
        enrollmentQuery,
      );

      console.log('enrolledCourses:' + JSON.stringify(enrolledCourses));

      const enrolledCourseIds = enrolledCourses.map(
        (enrollment) => enrollment.section.course.id,
      );

      console.log('enrolledCourseIds:' + enrolledCourseIds);

      // Find available sections for courses where the user is not already enrolled
      let availableSectionsQuery = Section.createQueryBuilder('section')
        .leftJoinAndSelect('section.course', 'course')
        .where('section.start_date > :currentDate', { currentDate });

      if (enrolledCourseIds.length > 0) {
        availableSectionsQuery = availableSectionsQuery.andWhere(
          'section.courseId NOT IN (:...enrolledCourseIds)',
          {
            enrolledCourseIds,
          },
        );
      }

      const availableSections = await availableSectionsQuery.getMany();

      return availableSections.map((section) => ({
        course_id: section.course.id,
        course_name: section.course.name,
        course_description: section.course.description,
        section_number: section.number,
        section_schedule: section.schedule,
        section_start_date: section.start_date.toISOString(),
      }));
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Could not retrieve available sections for user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
