import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateLectureDto } from './dto/create-lecture.dto';
import { Lecture } from './entity/lecture.entity';
import { LectureService } from './lecture.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../user/auth/auth.guard';

@ApiTags('LECTURE')
@Controller('lectures')
export class LectureController {
  constructor(private readonly lectureService: LectureService) {}

  @Get()
  ping() {
    return 'hello world';
  }

  //강의 코드, 교수명으로 강의 아이디 조회 API
  @Get('info')
  getLectureId(
    @Query('lecture_code') lecture_code: string,
    @Query('prof_id') prof_id: number,
  ): Promise<any> {
    return this.lectureService.getLectureId(lecture_code, prof_id);
  }

  //강좌별 강의 평가 조회 API
  @UseGuards(AuthGuard)
  @Get('get')
  getLectureInfo(
    @Query('lecture_id') lecture_id: number,
    @Query('prof_id') prof_id?: number,
  ): Promise<any> {
    return this.lectureService.getLectureInfo(lecture_id, prof_id);
  }

  //모든 강의 불러오기 API
  @Get('/all')
  getAll(): Promise<Lecture[]> {
    return this.lectureService.getAll();
  }

  //강의추가 API 관리자용
  @UseGuards(AuthGuard)
  @Post('/add')
  createLecture(@Body() lectureData: CreateLectureDto): Promise<string> {
    return this.lectureService.createLecture(lectureData);
  }

  //강의 삭제 API 관리자용
  @UseGuards(AuthGuard)
  @Delete('delete:id')
  DeleteLecture(@Param('id') id: number): Promise<any> {
    return this.lectureService.DeleteLecture(id);
  }
}
