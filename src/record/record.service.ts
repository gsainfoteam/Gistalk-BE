import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Lecture } from 'src/lecture/entity/lecture.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateRecordDto } from './dto/create-record.dto';
import { Record } from './entity/record.entity';
import { Semester } from 'src/semester/entity/semester.entity';
import { Year } from 'src/year/entity/year.entity';
import { User } from 'src/user/entity/user.entity';
import { Prof } from 'src/prof/entity/prof.entity';
import { UpdateRecordDto } from './dto/update-record.dto';

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
      prof_id,
      recommend,
    } = createrecorddto;
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
    if (!found) {
      throw new NotFoundException(
        `해당되는 id : ${lecture_id} 강의가 없거나 해당 교수가 담당하는 강의가 없습니다.`,
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
          uuid: user_uuid,
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
      record.recommend = recommend;
      record.user = await this.userRepository.findOne({
        relations: {
          records: true,
        },
        where: {
          uuid: user_uuid,
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

  async getLatestRecords(mount: number): Promise<any> {
    try {
      const result = await this.recordRepository.find({
        relations: { semesters: true, years: true },
        order: {
          id: 'DESC',
        },
        take: Number(mount),
      });
      const modifiedResults = result.map((record) => ({
        id: record.id,
        difficulty: record.difficulty,
        strength: record.strength,
        helpful: record.helpful,
        interest: record.interest,
        lots: record.lots,
        satisfy: record.satisfy,
        review: record.review,
        recommend: record.recommend,
        semesterId: record.semesters.id,
        year: record.years.year,
        lecture_id: record.lecture.id,
        lecture_name: record.lecture.lecture_name,
        lecture_code: record.lecture.lecture_code,
        prof_id: record.prof.id,
        prof_name: record.prof.prof_name,
      }));
      return modifiedResults;
    } catch (e) {
      throw new BadRequestException('Must be number.');
    }
  }

  async updateRecord(
    record_id: number,
    updaterecorddto: UpdateRecordDto,
  ): Promise<any> {
    const result = await this.recordRepository.findOne({
      where: {
        id: record_id,
      },
    });
    if (result) {
      try {
        let modifiedResults = JSON.parse(JSON.stringify(result));
        modifiedResults.difficulty = updaterecorddto.difficulty;
        modifiedResults.strength = updaterecorddto.strength;
        modifiedResults.helpful = updaterecorddto.helpful;
        modifiedResults.interest = updaterecorddto.interest;
        modifiedResults.lots = updaterecorddto.lots;
        modifiedResults.satisfy = updaterecorddto.satisfy;
        modifiedResults.review = updaterecorddto.review;
        modifiedResults.recommend = updaterecorddto.recommend;
        delete modifiedResults.lecture;
        delete modifiedResults.prof;
        await this.recordRepository.update(record_id, modifiedResults);
        const found = await this.recordRepository.findOne({
          where: {
            id: record_id,
          },
        });
        return found;
      } catch (e) {
        return e;
      }
    }
  }
}
