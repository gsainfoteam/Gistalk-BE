import {
  Body,
  ConflictException,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { CreateRecordDto } from './dto/create-record.dto';
import { RecordService } from './record.service';
import { ApiTags } from '@nestjs/swagger';
import { ScoringService } from 'src/scoring/scoring.service';

@ApiTags('RECORD')
@Controller('records')
export class RecordController {
  constructor(
    private readonly recordservice: RecordService,
    private readonly scoringService: ScoringService,
  ) {}

  //모든 강의평가 가져오기
  @Get('all')
  getAll(): Promise<any> {
    return this.recordservice.getAll();
  }

  //강의평가 추가
  @Post('add')
  async createRecord(
    @Body(new ValidationPipe()) createrecorddto: CreateRecordDto,
  ): Promise<any> {
    try {
      await this.recordservice.createRecord(createrecorddto);
      await this.scoringService.scoring(createrecorddto.lecture_id); // 강의평 평점 계산
      return 'success';
    } catch (error) {
      return error.response;
    }
  }
}
