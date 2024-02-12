import { Lecture } from 'src/lecture/entity/lecture.entity';
import { Record } from 'src/record/entity/record.entity';
import { Scoring } from 'src/scoring/entity/scoring.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';

@Entity()
export class Prof {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  prof_name: string;

  @OneToMany((Type) => Record, (record) => record.prof)
  records: Record[];

  @ManyToMany(() => Lecture, (lectures) => lectures.prof)
  @JoinTable()
  lectures: Lecture[];

  @OneToMany((Type) => Scoring, (score) => score.prof)
  scorings: Scoring[];
}
