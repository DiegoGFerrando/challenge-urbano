import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Course } from '../course/course.entity';
import { Enrollment } from '../enrollment/enrollment.entity';

@Entity()
export class Section extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  number: number;

  @Column()
  schedule: string;

  @Column()
  start_date: Date;

  @Column()
  end_date: Date;

  @Column({ select: false, nullable: false })
  courseId: string;

  @ManyToOne(() => Course, (course) => course.sections)
  course: Course;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.section)
  enrollments: Enrollment[];
}
