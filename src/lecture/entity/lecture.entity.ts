import { Prof } from 'src/prof/entity/prof.entity';
import { Record } from 'src/record/entity/record.entity';
import { Scoring } from 'src/scoring/entity/scoring.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  OneToOne,
} from 'typeorm';

@Entity()
export class Lecture {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  lecture_code: string; 
  @Column()
  lecture_name: string;

  @ManyToOne((Type) => Prof, { cascade: true })
  @JoinColumn()
  prof: Prof;

  @OneToMany((Type) => Record, (record) => record.lecture)
  records: Record[];

  @OneToOne(() => Scoring, (socring) => socring.lecture)
  scoring: Scoring;
}
// prof => prof.prof_name,
