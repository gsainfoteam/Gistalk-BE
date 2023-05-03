import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lecture } from 'src/lecture/entity/lecture.entity';
import { Record } from './entity/record.entity';
import { RecordController } from './record.controller';
import { RecordService } from './record.service';
import { UserModule } from 'src/user/user.module';
import { Semester } from 'src/semester/entity/semester.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Record, Lecture, Semester]),
  UserModule],
  providers: [RecordService],
  controllers: [RecordController],
})
export class RecordModule {}
