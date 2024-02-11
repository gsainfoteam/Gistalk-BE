import {
  Body,
  ConflictException,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { CreateRecordDto } from './dto/create-record.dto';
import { RecordService } from './record.service';
import { ApiTags } from '@nestjs/swagger';
import { ScoringService } from 'src/scoring/scoring.service';
import { AuthGuard } from 'src/user/auth/auth.guard';
import { UserService } from 'src/user/user.service';

@ApiTags('RECORD')
@Controller('records')
export class RecordController {
  constructor(
    private readonly recordservice: RecordService,
    private readonly scoringService: ScoringService,
    private readonly userSerice: UserService,
  ) {}

  //모든 강의평가 가져오기
  @UseGuards(AuthGuard)
  @Get('all')
  getAll(): Promise<any> {
    return this.recordservice.getAll();
  }

  // 최신강의평 불러오기
  @Get('latest/:mount')
  async getLatestRecords(
    @Param('mount')
    mount: number,
  ): Promise<any> {
    return await this.recordservice.getLatestRecords(mount);
  }

  //강의평가 추가
  @UseGuards(AuthGuard)
  @Post('add')
  async createRecord(
    @Req() req,
    @Body(new ValidationPipe())
    createrecorddto: CreateRecordDto,
  ): Promise<any> {
    const uuid = await this.userSerice.userInfo(
      req.headers.authorization.split(' ').slice(-1)[0],
    );
    try {
      await this.recordservice.createRecord(createrecorddto, uuid.user_uuid);
      await this.scoringService.scoring(createrecorddto.lecture_id); // 강의평 평점 계산
      return 'success';
    } catch (error) {
      return error.response;
    }
  }
}
