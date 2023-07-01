import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LectureService } from 'src/lecture/lecture.service';
import { Scoring } from 'src/scoring/entity/scoring.entity';
import { Prof } from './entity/prof.entity';
import { ProfController } from './prof.controller';
import { ProfService } from './prof.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Prof, Scoring]), UserModule],
  providers: [ProfService],
  controllers: [ProfController],
})
export class ProfModule {}
