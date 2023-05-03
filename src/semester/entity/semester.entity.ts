import { Lecture } from 'src/lecture/entity/lecture.entity';
import { Record } from 'src/record/entity/record.entity';
import {
    Column,
  Entity,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Semester {
  @PrimaryGeneratedColumn()
  id : number
  
  @Column()
  semester : string;
  
  @OneToMany((Type) => Record, (record) => record.semesters, { eager: true })
  records: Record[];

}


