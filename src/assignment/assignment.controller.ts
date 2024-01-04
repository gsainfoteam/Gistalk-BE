import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CreateLectureDto } from '../lecture/dto/create-lecture.dto';
import { LectureService } from '../lecture/lecture.service';
import { AssignmentService } from './assignment.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('assignment')
//@UseGuards(AuthGuard())
export class AssignmentController {
  constructor(private readonly assignmentService: AssignmentService) {}

  //과제 평가
  @Post('add')
  @UseGuards(AuthGuard())
  createLectureAssignment(
    @Req() req,
    @Body() createLectureAssignment: CreateAssignmentDto,
  ): Promise<string> {
    return this.assignmentService.createAssignment(
      createLectureAssignment,
      req.user.id,
    );
  }
}
