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

  /**강좌별 강의 평가 조회  API*/
  async getLectureInfo(lecture_id: number): Promise<any> {
    const found = await this.lectureRepository.findOneBy({ id: lecture_id });

    if (!found) {
      throw new NotFoundException(
        `ID에 할당된 강의가 없습니다 ID : ${lecture_id}`,
      );
    } else {
      const lecture = await this.lectureRepository.findOne({
        relations: {
          records: {
            years : true,
            semesters : true
          },
        },
        where: {
          id: lecture_id,
        },
      });

      const filter = lecture.records;
      const parse : any = filter[0]
      const obj = {
        id : parse.id,
        difficulty : parse.difficulty,
        strength : parse.strength,
        helpful : parse.helpful,
        interest : parse.interest,
        lots : parse.lots,
        satisfy : parse.satisfy,
        review : parse.review,
        evaluation : parse.evaluation,
        semester : parse.semesters.id,
        year : parse.years.year
      };
      return obj;
    }
  }

  /**강의 아이디 조회 API*/
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
          prof_name : prof_name,
          lectures : false
        }
      }
    })

    if(found.length == 0)
    {
      throw new NotFoundException(`해당되는 강의 코드의 강의가 없습니다. 강의코드 : ${lecture_code}`);
    }
    return await this.json_filter(found)
  }

  /**강의 추가 API*/
  //typerom 문서 일대다 연결하는법  중복오류 교수 테이블 따로 만든 상태에서 강의 테이블 생성 시 교수명을 참조키로 가져와야함
  async createProfLecture(
    createLectureDto: CreateLectureDto,
  ): Promise<string> {
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
        return "success";
      }
      else {
        throw new ConflictException(`이미 등록된 강의(${lecture_name})-교수(${prof_name}) 입니다.`);
      }
    } else {
      throw new NotFoundException(`해당되는 교수명(${prof_name}) 가 없습니다.`);
    }
  }

  /**전공 리스트로 바꿔주는 함수*/
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

  /**강의 아이디 조회 api json 필터링 함수*/
  async json_filter(found : any): Promise<any> {
    const src = JSON.stringify(found)
    const src1 = src.split(',')
    const src_id1 = src1[0]
    const src_id = src_id1.split(':')[1]
    const src_code1 = src1[1].split(':')
    const src_code = src_code1[1].toString().split("'")[1]
    const src_prof_id = src1[2].split(':')[2]
    const src_prof_name = src1[3].split(':')[1].split('"')[1]
    const obj = {
      id : src_id,
      lecture_code : src_code,
      prof_id : src_prof_id,
      prof_name : src_prof_name
    }
    const json = JSON.stringify(obj)
    console.log(json)
    return json
  }

  /**강의 id 조회로 삭제 기능 */
  async remove(id: number): Promise<void> {
    await this.lectureRepository.delete(id);
  }

  
  async DeleteLecture(id : number): Promise<void>
  {
    const result = await this.lectureRepository.delete(id);
  }
}
