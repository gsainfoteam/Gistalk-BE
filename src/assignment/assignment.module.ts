import { Module } from '@nestjs/common';
import { AssignmentService } from './assignment.service';
import { AssignmentController } from './assignment.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Assignment} from "./entity/assignment.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Assignment])],
  providers: [AssignmentService],
  controllers: [AssignmentController]
})
export class AssignmentModule {}
