import { Lecture } from 'src/lecture/entity/lecture.entity';
import { Scoring } from 'src/scoring/entity/scoring.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  PrimaryColumn,
  Unique,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Prof {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  prof_name: string;

  @OneToMany((Type) => Lecture, (lecture) => lecture.prof, { eager: true }) //eager
  lectures: Lecture[];
}
 