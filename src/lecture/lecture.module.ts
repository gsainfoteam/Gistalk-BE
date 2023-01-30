import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lecture_Date } from 'src/date/entity/date.entity';
import { Prof } from 'src/prof/entity/prof.entity';
import { Record } from 'src/record/entity/record.entity';
import { Lecture } from './entity/lecture.entity';
import { LectureController } from './lecture.controller';
import { LectureService } from './lecture.service';

@Module({
  imports: [TypeOrmModule.forFeature([Lecture, Prof, Lecture_Date])],
  providers: [LectureService],
  controllers: [LectureController]
})
export class LectureModule {}
