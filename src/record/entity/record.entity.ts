import { Lecture } from 'src/lecture/entity/lecture.entity';
import { Prof } from 'src/prof/entity/prof.entity';
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
  OneToOne,
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
  @Column({ type: 'varchar', length: 3000 })
  review: string;

  @Column({ default: 2 })
  recommend: number; // 추천 1 비추천 0 표시 없음 2

  @ManyToOne((Type) => Lecture, (lecture) => lecture.lecture_name, {
    eager: true,
  })
  lecture: Lecture;

  @ManyToOne((Type) => Prof, (prof) => prof.id, {
    eager: true,
  })
  prof: Prof;

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
