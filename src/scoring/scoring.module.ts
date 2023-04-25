import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lecture } from 'src/lecture/entity/lecture.entity';
import { Scoring } from './entity/scoring.entity';
import { scoringrepo } from './repository/scoring.repository';
import { ScoringController } from './scoring.controller';
import { ScoringService } from './scoring.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Scoring, Lecture]),
  UserModule],
  controllers: [ScoringController],
  providers: [ScoringService],
})
export class ScoringModule {}
