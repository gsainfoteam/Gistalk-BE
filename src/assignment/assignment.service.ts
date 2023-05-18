import { Injectable } from '@nestjs/common';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Assignment } from './entity/assignment.entity';
import { Repository } from 'typeorm';
import { Record } from 'src/record/entity/record.entity';

@Injectable()
export class AssignmentService {
    constructor(
        @InjectRepository(Record)
        private recordRepository: Repository<Record>,
        @InjectRepository(Assignment)
        private assignmentRepository: Repository<Assignment>,
    ) {}

    async createLectureAssignment(createAssignmentDto: CreateAssignmentDto, id:number): Promise<any>{
        const {record_id, practice, report, project, other} = createAssignmentDto;
        this.assignmentRepository.save(createAssignmentDto);
    }

}
