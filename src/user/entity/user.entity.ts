import {
  Entity,
  Column,
  ManyToOne,
  PrimaryColumn,
  Binary,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['email'])
export class User {
  @PrimaryColumn()
  uuid : string;

  @Column()
  email : string;

  @Column({default : "user"})
  role : string;

  //1:n 관계로 강의평 엔티티 맵핑.

}
