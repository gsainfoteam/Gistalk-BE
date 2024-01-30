import { Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ScoringService } from './scoring.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('SCROEING')
@Controller('scoring')
export class ScoringController {
  constructor(private readonly scoringService: ScoringService) {}

  //강평 점수 최초 1회 계산
  @Post('get/:lecture_id')
  scoring(@Param('lecture_id') lecture_id: number): Promise<any> {
    return this.scoringService.scoring(lecture_id);
  }

  //강평 점수 계산한 것 가져오기
  @Get('get/:lecture_id')
  getScoring(@Param('lecture_id') lecture_id: number): Promise<any> {
    return this.scoringService.getScoring(lecture_id);
  }

  //강평 점수 업데이트
  @Patch('get/:lecture_id')
  updateScoring(@Param('lecture_id') lecture_id: number): Promise<any> {
    return this.scoringService.updateScoring(lecture_id);
  }
}
