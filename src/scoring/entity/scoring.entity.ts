import { Lecture } from 'src/lecture/entity/lecture.entity';
import { Prof } from 'src/prof/entity/prof.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Scoring {
  map(
    arg0: (score: any) => {
      id: any;
      difficulty: any;
      strength: any;
      helpful: any;
      interest: any;
      lots: any;
      satisfy: any;
      review: any;
      recommend: any;
      year: any;
    },
  ) {
    throw new Error('Method not implemented.');
  }
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  lecture_id: number;

  @Column()
  people: number;

  @Column()
  diff_aver: number;

  @Column()
  stren_aver: number;

  @Column()
  help_aver: number;

  @Column()
  inter_aver: number;

  @Column()
  lots_aver: number;

  @Column()
  sati_aver: number;

  @Column()
  good: number;

  @Column()
  bad: number;

  // @Column()
  // total_score: string;

  @ManyToOne(() => Lecture, (lecture) => lecture.scoring)
  lecture: Lecture;

  @ManyToOne((Type) => Prof, (prof) => prof.id, {
    eager: true,
  })
  prof: Prof;
  scoring: Lecture;
}
