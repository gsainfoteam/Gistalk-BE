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
  ManyToMany,
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

  @OneToMany((Type) => Record, (record) => record.lecture)
  records: Record[];

  @OneToMany(() => Scoring, (socring) => socring.lecture)
  scoring: Scoring;

  @ManyToMany(() => Prof, (prof) => prof.lectures)
  prof: Prof[];
}
// prof => prof.prof_name,
