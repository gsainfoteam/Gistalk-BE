import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    JoinColumn,
    OneToOne,
} from 'typeorm';
import {Record} from "../../record/entity/record.entity";

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

    @OneToOne(() => Record, (record) => record.assignment)
    @JoinColumn()
    record : Record;
}
