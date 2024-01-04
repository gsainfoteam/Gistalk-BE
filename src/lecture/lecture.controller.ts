import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateLectureDto } from './dto/create-lecture.dto';
import { Lecture } from './entity/lecture.entity';
import { LectureService } from './lecture.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('lectures')
//@UseGuards(AuthGuard())
export class LectureController {
  constructor(private readonly lectureService: LectureService) {}

  //강의 코드, 교수명으로 강의 아이디 조회 API
  @Get('getting')
  getLectureId(
    @Query('lecture_code') lecture_code: string,
    @Query('prof_name') prof_name: string,
  ): Promise<any> {
    return this.lectureService.getLectureId(lecture_code, prof_name);
  }

  //강좌별 강의 평가 조회 API
  @Get('get/:lecture_id')
  getLectureInfo(@Param('lecture_id') lecture_id: number): Promise<any> {
    return this.lectureService.getLectureInfo(lecture_id);
  }

  //강의추가 API
  @Post('/add')
  createProfLecture(@Body() lectureData: CreateLectureDto): Promise<string> {
    return this.lectureService.createProfLecture(lectureData);
  }

  //강의 삭제 API
  @Delete('delete:id')
  DeleteLecture(@Param('id') id: number): Promise<any> {
    return this.lectureService.DeleteLecture(id);
  }
}
