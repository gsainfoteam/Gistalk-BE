import { Lecture } from 'src/lecture/entity/lecture.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  PrimaryColumn,
  Unique,
  ManyToMany,
  ManyToOne,
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
  oneline: string; //한줄평

  @Column() // 나중에 연결합니다
  user_id: string;

  @ManyToOne((Type) => Lecture, (lecture) => lecture.lecture_name, {
    cascade: true,
    eager: true,
  })
  lecture: Lecture;
}
