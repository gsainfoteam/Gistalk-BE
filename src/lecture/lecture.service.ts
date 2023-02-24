import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { filter } from 'rxjs';
import { Prof } from 'src/prof/entity/prof.entity';
import { Record } from 'src/record/entity/record.entity';
import { Repository } from 'typeorm';
import { ScoreData } from './data/ScoreData.model';
import { CreateLectureDto } from './dto/create-lecture.dto';
import { Lecture } from './entity/lecture.entity';

@Injectable()
export class LectureService {
  constructor(
    @InjectRepository(Lecture)
    private lectureRepository: Repository<Lecture>,
    @InjectRepository(Prof)
    private profRepository: Repository<Prof>,
  ) {}

  //강좌별 강의 평가 조회 API
  async getLectureInfo(lecture_id: number): Promise<any> {
    const found = await this.lectureRepository.findOneBy({ id: lecture_id });

    if (!found) {
      throw new NotFoundException(
        `ID에 할당된 강의가 없습니다 ID : ${lecture_id}`,
      );
    } else {
      const lecture = await this.lectureRepository.findOne({
        relations: {
          records: true,
        },
        where: {
          id: lecture_id,
        },
      });

      return lecture;
    }
  }

  //강의 아이디 조회 API
  async getLectureId(lecture_code : string, prof_name :string)
  {
    const found = await this.lectureRepository.find({
      select : {
        id : true,
        lecture_code : true,
      },
      relations : {
        prof : true
      },
      where : {
        lecture_code : await this.toListForm(lecture_code),
        prof : {
          prof_name : prof_name
        }
      }
    })
    
    if(found.length == 0)
    {
      throw new NotFoundException(`해당되는 강의 코드의 강의가 없습니다. 강의코드 : ${lecture_code}`);
    }
    return found
  }

  //강의 추가 API
  //typerom 문서 일대다 연결하는법  중복오류 교수 테이블 따로 만든 상태에서 강의 테이블 생성 시 교수명을 참조키로 가져와야함
  async createProfLecture(
    createLectureDto: CreateLectureDto,
  ): Promise<Lecture> {
    //Promise<Lecture>
    const { lecture_name, lecture_code, prof_name } =
      createLectureDto;

    const found = await this.profRepository.findOneBy({ prof_name: prof_name });

    const lecture_found = await this.lectureRepository.findOne
      ({
        select : {
          id : true,
          lecture_code : true,
          lecture_name : true,
        },
        relations : {
          prof : true
        },
        where : {
          lecture_code : await this.toListForm(lecture_code),
          lecture_name : lecture_name,
          prof : {
            prof_name : prof_name
          }
        }
      });

    if (found) {
      if(!lecture_found){
        const lecture = new Lecture();
        lecture.lecture_name = lecture_name;
        lecture.lecture_code = await this.toListForm(lecture_code);
        lecture.prof = await this.profRepository.findOne({
          relations: {
            lectures: true,
          },
          where: {
            prof_name: prof_name,
          },
        });

        await this.lectureRepository.manager.save(lecture);
        return lecture;
      }
      else {
        throw new ConflictException(`이미 등록된 강의(${lecture_name})-교수(${prof_name}) 입니다.`);
      }
    } else {
      throw new NotFoundException(`해당되는 교수명(${prof_name}) 가 없습니다.`);
    }
  }

  // 전공 리스트로 바꿔주는 함수
  async toListForm(data: string): Promise<string> {
    const arr = data.split(' ');
    let i: number;

    let result = '[';
    for (i = 0; i < arr.length; i++) {
      result += `'${arr[i]}', `;
    }
    let newResult = result.slice(0, -2);
    newResult += ']';
    return newResult;
  }

  async remove(id: number): Promise<void> {
    await this.lectureRepository.delete(id);
  }

  async DeleteLecture(id : number): Promise<void>
  {
    const result = await this.lectureRepository.delete(id);
  }
}
