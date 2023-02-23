import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { Prof } from 'src/prof/entity/prof.entity';
import { CreateLectureDto } from './dto/create-lecture.dto';
import { Lecture } from './entity/lecture.entity';
import { LectureService } from './lecture.service';

@Controller('lectures')
export class LectureController {
  constructor(private readonly lectureService: LectureService) {}

  //강의 코드로 강의 아이디 조회 API
  @Get('getting:lecture_code')
  getLectureId(@Param('lecture_code') lecture_code: string): Promise<any> {
    return this.lectureService.getLectureId(lecture_code)
  }

  //강좌별 강의 평가 조회 API
  @Get('get:lecture_id')
  getLectureInfo(@Param('lecture_id') lecture_id: number): Promise<any> {
    return this.lectureService.getLectureInfo(lecture_id);
  }

  //강의추가 API
  @Post('/add')
  createProfLecture(@Body() lectureData: CreateLectureDto): Promise<Lecture> {
    return this.lectureService.createProfLecture(lectureData);
  }

  //강의 삭제 API
  @Delete("delete:id")
  DeleteLecture(@Param('id') id : number): Promise<any>
  {
    return this.lectureService.DeleteLecture(id);
  }
}
