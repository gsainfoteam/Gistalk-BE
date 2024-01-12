import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateRecordDto } from './dto/create-record.dto';
import { RecordService } from './record.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('records')
//@UseGuards(AuthGuard())
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
}
