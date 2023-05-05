import { Record } from 'src/record/entity/record.entity';
import {
    Entity,
    Column,
    ManyToOne,
    PrimaryColumn,
    Binary,
    PrimaryGeneratedColumn,
    Unique,
    OneToMany,
  } from 'typeorm';
  
@Entity()
export class Year {
  @PrimaryColumn()
  year : string;

  @OneToMany((Type) => Record, (record) => record.years, { eager: true })
  records: Record[];
}
  