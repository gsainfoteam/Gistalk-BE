import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lecture } from './lecture/entity/lecture.entity';
import { LectureController } from './lecture/lecture.controller';
import { LectureModule } from './lecture/lecture.module';
import { LectureService } from './lecture/lecture.service';
import { ProfController } from './prof/prof.controller';
import { ProfService } from './prof/prof.service';
import { ProfModule } from './prof/prof.module';
import { Prof } from './prof/entity/prof.entity';
import { RecordController } from './record/record.controller';
import { RecordService } from './record/record.service';
import { RecordModule } from './record/record.module';
import { Record } from './record/entity/record.entity';
import { ScoringModule } from './scoring/scoring.module';
import { Scoring } from './scoring/entity/scoring.entity';
import { DateModule } from './date/date.module';
import { Lecture_Date } from './date/entity/date.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '12345678',
      database: 'gistalk',
      entities: [Lecture, Prof, Record, Scoring, Lecture_Date],
      synchronize: true,
    }),
    LectureModule,
    ProfModule,
    RecordModule,
    ScoringModule,
    DateModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
