import { Module } from '@nestjs/common';
import { DateService } from './date.service';
import { DateController } from './date.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lecture_Date } from './entity/date.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lecture_Date])],
  providers: [DateService],
  controllers: [DateController],
})
export class DateModule {}
