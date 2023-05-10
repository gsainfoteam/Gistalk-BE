import { Lecture } from 'src/lecture/entity/lecture.entity';
import { Semester } from 'src/semester/entity/semester.entity';
import { User } from 'src/user/entity/user.entity';
import { Year } from 'src/year/entity/year.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  PrimaryColumn,
  Unique,
  ManyToMany,
  ManyToOne,
  JoinTable,
} from 'typeorm';

@Entity()
export class Record {
  @PrimaryGeneratedColumn()
  id: number;
  //육각형 강의평가 테이블
  @Column()
  difficulty: number; //난이도

  @Column()
  strength: number; //강의력

  @Column()
  helpful: number; //유익함

  @Column()
  interest: number; //흥미

  @Column()
  lots: number; //과제량

  @Column()
  satisfy: number; //만족도
  //리뷰
  @Column()
  review: string;

  @Column({default : 2})
  evaluation : number // 추천 1 비추천 0 표시 없음 2

  @ManyToOne((Type) => Lecture, (lecture) => lecture.lecture_name, {
    cascade: true,
    eager: true,
  })
  lecture: Lecture;

  @ManyToOne((Type) => Semester, { cascade: true })
  @JoinTable()
  semesters: Semester;

  @ManyToOne((Type) => Year, { cascade: true })
  @JoinTable()
  years: Year;

  @ManyToOne((Type) => User, { cascade: true })
  @JoinTable()
  user: User;
}
