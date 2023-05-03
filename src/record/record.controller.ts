import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { RecordService } from './record.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('records')
@UseGuards(AuthGuard())
export class RecordController {
  constructor(private readonly recordservice: RecordService) {}

  //모든 강의평가 가져오기
  @Get('all')
  getAll(): Promise<any> {
    return this.recordservice.getAll();
  }

  //강의평가 추가
  @Post('add')
  createRecord(@Body() createrecorddto: CreateRecordDto): Promise<any> {
    return this.recordservice.createRecord(createrecorddto);
  }

  //강의평가수정 : 강의평은 삭제가 되지 않는 것을 기본으로 함. 아래 코드는 이전 버전으로 호환되지 않음
  @Patch(':user_id/:lecture_id/modify')
  updateRecord(
    @Param('lecture_id') lecture_id: number,
    @Param('user_id') user_id: string,
    @Body() modify: UpdateRecordDto,
  ): Promise<any> {
    return this.recordservice.updateRecord(lecture_id, user_id, modify);
  }
}
