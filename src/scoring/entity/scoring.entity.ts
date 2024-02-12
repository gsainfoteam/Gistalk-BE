import { Lecture } from 'src/lecture/entity/lecture.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';

@Entity()
export class Scoring {
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

  @OneToOne(() => Lecture, (lecture) => lecture.scoring)
  @JoinColumn()
  lecture: Lecture;
}
