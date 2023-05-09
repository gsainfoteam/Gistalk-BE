import { Record } from 'src/record/entity/record.entity';
import { User } from 'src/user/entity/user.entity';
import {
  Entity,
  Column,
  ManyToOne,
  PrimaryColumn,
  Binary,
  PrimaryGeneratedColumn,
  Unique,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity()
export class UserAuth {
  @PrimaryGeneratedColumn()
  id : number;
  
  @Column('int', {name: 'user_id'})
  userId: number;

  @Column('varchar', {name: 'authority_name'})
  authorityName: string;

  @ManyToOne(type => User, user => user.authorities)
  @JoinColumn({name: 'user_id'})
  user: User

}
