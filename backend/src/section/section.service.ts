import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FindManyOptions, ILike } from 'typeorm';

import { CourseService } from '../course/course.service';
import { CreateSectionDto, UpdateSectionDto } from './section.dto';
import { Section } from './section.entity';
import { SectionQuery } from './section.query';

@Injectable()
export class SectionService {
  constructor(private readonly courseService: CourseService) {}

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
}
