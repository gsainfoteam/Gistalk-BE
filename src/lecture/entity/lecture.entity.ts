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
  lecture_code: string; //다른 교수가 같은 코드를 맡을 경우 기본키로 지정불가
  //전공, 부전공, 분야 분류는 과목코드에서 index(1)번까지 빼도 될듯
  @Column()
  lecture_name: string;

  @Column()
  division_field: string; //소속

  @ManyToOne((Type) => Prof, { cascade: true })
  @JoinColumn()
  prof: Prof;

  @OneToMany((Type) => Record, (record) => record.lecture)
  records: Record[];

  @OneToOne(() => Scoring, (socring) => socring.lecture)
  scoring: Scoring;
}
// prof => prof.prof_name,
