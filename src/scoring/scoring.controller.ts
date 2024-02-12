import { Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ScoringService } from './scoring.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/user/auth/auth.guard';

@ApiTags('SCROEING')
@Controller('scoring')
export class ScoringController {
  constructor(private readonly scoringService: ScoringService) {}

  //강평 점수 계산한 것 가져오기
  @Get('get/:lecture_id')
  async getScoring(
    @Param('lecture_id') lecture_id: number,
    @Param('prof_id') prof_id?: number,
  ): Promise<any> {
    await this.scoringService.scoring(lecture_id);
    await this.scoringService.updateScoring(lecture_id);
    return this.scoringService.getScoring(lecture_id);
  }
}
