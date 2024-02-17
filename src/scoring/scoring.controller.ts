import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ScoringService } from './scoring.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/user/auth/auth.guard';
import { GetScoringDto } from './dto/get-scoring.dto';

@ApiTags('SCROEING')
@Controller('scoring')
export class ScoringController {
  constructor(private readonly scoringService: ScoringService) {}

  //강평 점수 계산한 것 가져오기
  @Get('get/:lecture_id/:prof_id')
  async getScoring(
    @Param('lecture_id') lecture_id: number,
    @Param('prof_id') prof_id?: number,
  ): Promise<any> {
    await this.scoringService.scoring(lecture_id, prof_id);
    await this.scoringService.updateScoring(lecture_id, prof_id);
    return await this.scoringService.getScoring(lecture_id, prof_id);
  }

  @Get('get/total')
  async getTotalScoring(@Query('') lecture_id: number): Promise<any> {
    return await this.scoringService.getTotalScoring(lecture_id);
  }
}
