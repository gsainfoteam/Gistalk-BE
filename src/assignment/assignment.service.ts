import {
    Injectable,
    ConflictException,
    NotFoundException
} from '@nestjs/common';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Assignment } from './entity/assignment.entity';
import { Repository } from 'typeorm';
import { Lecture } from 'src/lecture/entity/lecture.entity';
import { Semester } from 'src/semester/entity/semester.entity';
import { Year } from 'src/year/entity/year.entity';
import { User } from 'src/user/entity/user.entity';

@Injectable()
export class AssignmentService {
    constructor(
        @InjectRepository(Assignment)
        private assignmentRepository: Repository<Assignment>,
        @InjectRepository(Lecture)
        private lectureRepository: Repository<Lecture>,
        @InjectRepository(Semester)
        private semesterRepository: Repository<Semester>,
        @InjectRepository(Year)
        private yearRepository: Repository<Year>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async getAll(): Promise<Assignment[]> {
        return this.assignmentRepository.find({});
    }

    async createAssignment(createAssignmentDto: CreateAssignmentDto, id:number): Promise<string>{
        const {
            practice,
            report,
            project,
            other,
            lecture_id,
            semester_id,
            year
        } = createAssignmentDto;

        const user_id = id;

        //강의 검색
        const found = await this.lectureRepository.findOneBy({ id: lecture_id });
        
        //해당 과제 작성이력 조회
        const found_user = await this.assignmentRepository.findOne({
            relations: {
                lecture: true,
                user : true
            },
            where: {
                user : {
                    id: user_id
                },
                lecture : {
                    id: lecture_id
                },
            }
        });

        if (found_user) {
            throw new ConflictException(
              `이미 강의의 과제를 평가`
            );
          } else { // conditon 이전에 (lecture id , uuid)의 꼴이 같지 않는 경우를 세야함. 
            if (found) {
              const assignment = new Assignment();
              assignment.practice = practice;
              assignment.report = report;
              assignment.project = project;
              assignment.other = other;
              assignment.user = await this.userRepository.findOne({
                relations : {
                  records : true,
                },
                where : {
                  id : user_id
                }
              })
              assignment.years = await this.yearRepository.findOne({
                relations : {
                  records : true,
                },
                where : {
                  year : year
                }
              })
              assignment.semesters = await this.semesterRepository.findOne({
                relations: {
                  records: true,
                },
                where : {
                  id : semester_id
                }
              })
              assignment.lecture = await this.lectureRepository.findOne({
                relations: {
                  records: true,
                },
                where: {
                  id: lecture_id,
                },
              });
      
              await this.assignmentRepository.manager.save(assignment);
              return "success";
            } else {
              throw new NotFoundException(
                `해당되는 id : ${lecture_id} 강의가 없습니다.`,
              );
            }
          }
    }

}
