import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    JoinColumn,
    OneToOne,
    ManyToMany,
    ManyToOne,
    JoinTable,
} from 'typeorm';
import { Lecture } from 'src/lecture/entity/lecture.entity';
import { Semester } from 'src/semester/entity/semester.entity';
import { User } from 'src/user/entity/user.entity';
import { Year } from 'src/year/entity/year.entity';

@Entity()
export class Assignment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    practice: boolean;

    @Column()
    report: boolean;

    @Column()
    project: boolean;

    @Column()
    other: boolean;

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
