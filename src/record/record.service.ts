import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Lecture } from 'src/lecture/entity/lecture.entity';
import { Repository } from 'typeorm';
import { CreateRecordDto } from './dto/create-record.dto';
import { Record } from './entity/record.entity';
import { Semester } from 'src/semester/entity/semester.entity';
import { Year } from 'src/year/entity/year.entity';
import { User } from 'src/user/entity/user.entity';
import { Prof } from 'src/prof/entity/prof.entity';

@Injectable()
export class RecordService {
  constructor(
    @InjectRepository(Record)
    private recordRepository: Repository<Record>,
    @InjectRepository(Lecture)
    private lectureRepository: Repository<Lecture>,
    @InjectRepository(Semester)
    private semesterRepository: Repository<Semester>,
    @InjectRepository(Year)
    private yearRepository: Repository<Year>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Prof)
    private profRepository: Repository<Prof>,
  ) {}

  //모든 강의 평가 조회 API
  async getAll(): Promise<Record[]> {
    return this.recordRepository.find({});
  }

  //강의 평가 추가 API
  async createRecord(
    createrecorddto: CreateRecordDto,
    user_uuid: string,
  ): Promise<string> {
    const {
      difficulty,
      strength,
      helpful,
      interest,
      lots,
      satisfy,
      review,
      lecture_id,
      semester_id,
      year,
      user_id,
      prof_id,
    } = createrecorddto;
    console.log(user_uuid);
    //강의 검색
    const found = await this.lectureRepository.findOne({
      relations: {
        prof: true,
      },
      where: {
        id: lecture_id,
        prof: {
          id: prof_id,
        },
      },
    });

    if (found == null) {
      throw new NotFoundException(
        `해당되는 id : ${lecture_id} 강의가 없습니다.`,
      );
    }

    //해당 강의 작성이력 조회
    const found_user = await this.recordRepository.findOne({
      relations: {
        lecture: true,
        user: true,
        years: true,
        semesters: true,
        prof: true,
      },
      where: {
        user: {
          id: user_id,
        },
        lecture: {
          id: lecture_id,
        },
        years: {
          year: year,
        },
        semesters: {
          id: semester_id,
        },
        prof: {
          id: prof_id,
        },
      },
    });

    if (found_user) {
      throw new ConflictException(`이미 강의를 평가`);
    } else {
      // conditon 이전에 (lecture id , uuid)의 꼴이 같지 않는 경우를 세야함.
      const record = new Record();
      record.difficulty = difficulty;
      record.strength = strength;
      record.helpful = helpful;
      record.interest = interest;
      record.lots = lots;
      record.satisfy = satisfy;
      record.review = review;
      record.user = await this.userRepository.findOne({
        relations: {
          records: true,
        },
        where: {
          id: user_id,
        },
      });
      record.years = await this.yearRepository.findOne({
        relations: {
          records: true,
        },
        where: {
          year: year,
        },
      });
      record.semesters = await this.semesterRepository.findOne({
        relations: {
          records: true,
        },
        where: {
          id: semester_id,
        },
      });
      record.lecture = await this.lectureRepository.findOne({
        relations: {
          records: true,
          prof: true,
        },
        where: {
          id: lecture_id,
          prof: {
            id: prof_id,
          },
        },
      });
      record.prof = await this.profRepository.findOne({
        relations: {
          records: true,
          lectures: true,
        },
        where: {
          id: prof_id,
          lectures: {
            id: lecture_id,
          },
        },
      });

      await this.recordRepository.manager.save(record);
      return 'success';
    }
  }
}
