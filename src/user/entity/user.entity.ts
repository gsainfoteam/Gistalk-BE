import {
  Entity,
  Column,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn()
  uuid: string; // uuid

  //1:n 관계로 강의평 엔티티 맵핑.

}
