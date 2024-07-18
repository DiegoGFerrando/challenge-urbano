import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

import { Section } from '../section/section.entity';
import { User } from '../user/user.entity';

@Entity()
export class Enrollment extends BaseEntity {
  @PrimaryColumn()
  sectionId: string;

  @PrimaryColumn()
  userId: string;

  // add the column 'enrolled_at' to the Enrollment entity
  @Column()
  enrolled_at: Date;

  @ManyToOne(() => Section, (section) => section.enrollments)
  section: Section;

  @ManyToOne(() => User, (user) => user.enrollments)
  user: User;
}
