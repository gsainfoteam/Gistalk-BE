import { Module } from '@nestjs/common';
import { AssignmentService } from './assignment.service';
import { AssignmentController } from './assignment.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Assignment} from "./entity/assignment.entity";
import { Semester } from 'src/semester/entity/semester.entity';
import { Year } from 'src/year/entity/year.entity';
import { User } from 'src/user/entity/user.entity';
import { Lecture } from 'src/lecture/entity/lecture.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Assignment, Lecture, Semester, Year, User])],
  providers: [AssignmentService],
  controllers: [AssignmentController]
})
export class AssignmentModule {}
