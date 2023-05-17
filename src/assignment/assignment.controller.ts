import {Body, Controller, Post} from '@nestjs/common';
import {CreateLectureDto} from "../lecture/dto/create-lecture.dto";
import {LectureService} from "../lecture/lecture.service";
import {AssignmentService} from "./assignment.service";

@Controller('assignment')
export class AssignmentController {

    constructor(private readonly assignmentService: AssignmentService) {}

    // @Post('/add')
    // createLectureAssignment(@Body() assignmentData: CreateassignmentDto): Promise<string> {
    //     return this.assignmentService.createProfLecture(lectureData);
    // }
}
