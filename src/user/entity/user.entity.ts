import { Record } from 'src/record/entity/record.entity';
import { UserAuth } from 'src/user_auth/entity/user-auth.entity';
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
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn()
  id : number;

  @Column()
  uuid : string;

  @Column()
  email : string;

  @OneToMany((Type) => Record, (record) => record.user)
  records: Record[];

  @OneToMany(type => UserAuth, userAuth => userAuth.user, {eager: true})
  authorities?: any[];

}
