
import { Lecture } from 'src/lecture/entity/lecture.entity';
import { Entity, Column, PrimaryGeneratedColumn, JoinTable, ManyToMany } from 'typeorm';

@Entity()
export class Lecture_Date {
  @PrimaryGeneratedColumn()
  id : number;

  @Column()
  date : string; //22학년도 봄학기 여름학기 가을학기 겨울학기

  @ManyToMany(() => Lecture, (lecture) => lecture.dates, {cascade : true})
  @JoinTable()
  lectures : Lecture[];
}
