import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lecture } from 'src/lecture/entity/lecture.entity';
import { Record } from './entity/record.entity';
import { RecordController } from './record.controller';
import { RecordService } from './record.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Record, Lecture]),
  UserModule],
  providers: [RecordService],
  controllers: [RecordController],
})
export class RecordModule {}
