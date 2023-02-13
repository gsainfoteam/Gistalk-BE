import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { Prof } from 'src/prof/entity/prof.entity';
import { CreateLectureDto } from './dto/create-lecture.dto';
import { Lecture } from './entity/lecture.entity';
import { LectureService } from './lecture.service';

@Controller('lectures')
export class LectureController {
  constructor(private readonly lectureService: LectureService) {}

  //강좌별 강의 평가 조회 API
  @Get('get:lecture_id')
  getLectureInfo(@Param('lecture_id') lecture_id: number): Promise<any> {
    return this.lectureService.getLectureInfo(lecture_id);
  }

  //강의추가
  @Post('/add')
  createProfLecture(@Body() lectureData: CreateLectureDto): Promise<Lecture> {
    return this.lectureService.createProfLecture(lectureData);
  }

  @Post('/update_:lecture_id')
  updateLecture(@Param('lecture_id') lecture_id: number, @Body() Data: any) {
    return this.lectureService.updatelecture(lecture_id, Data);
  }

  @Delete("delete:id")
  DeleteLecture(@Param('id') id : number): Promise<any>
  {
    return this.lectureService.DeleteLecture(id);
  }
}
