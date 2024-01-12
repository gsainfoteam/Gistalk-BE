import { Lecture } from 'src/lecture/entity/lecture.entity';
import { Scoring } from 'src/scoring/entity/scoring.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity()
export class Prof {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  prof_name: string;

  @ManyToMany(() => Lecture, (lectures) => lectures.prof)
  @JoinTable()
  lectures: Lecture[];
}
