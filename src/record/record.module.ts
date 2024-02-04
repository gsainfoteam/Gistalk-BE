import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lecture } from 'src/lecture/entity/lecture.entity';
import { Record } from './entity/record.entity';
import { RecordController } from './record.controller';
import { RecordService } from './record.service';
import { UserModule } from 'src/user/user.module';
import { Semester } from 'src/semester/entity/semester.entity';
import { Year } from 'src/year/entity/year.entity';
import { User } from 'src/user/entity/user.entity';
import { ScoringService } from 'src/scoring/scoring.service';
import { Scoring } from 'src/scoring/entity/scoring.entity';
import { Prof } from 'src/prof/entity/prof.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Record,
      Lecture,
      Semester,
      Record,
      Year,
      User,
      Scoring,
      Prof,
    ]),
    UserModule,
  ],
  providers: [RecordService, ScoringService],
  controllers: [RecordController],
})
export class RecordModule {}
