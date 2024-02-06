import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prof } from 'src/prof/entity/prof.entity';
import { Record } from 'src/record/entity/record.entity';
import { Lecture } from './entity/lecture.entity';
import { LectureController } from './lecture.controller';
import { LectureService } from './lecture.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Lecture, Prof]), UserModule],
  providers: [LectureService],
  controllers: [LectureController],
})
export class LectureModule {}
