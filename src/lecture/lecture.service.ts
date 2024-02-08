import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundError, filter, find, skip } from 'rxjs';
import { Prof } from 'src/prof/entity/prof.entity';
import { Record } from 'src/record/entity/record.entity';
import { DataSource, Repository } from 'typeorm';
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
  async getLectureInfo(lecture_id: number, prof_id?: number): Promise<any> {
    const found = await this.lectureRepository.findOneBy({ id: lecture_id });

    if (!found) {
      throw new NotFoundException(
        `ID에 할당된 강의가 없습니다 ID : ${lecture_id}`,
      );
    } else {
      let lecture;
      if (prof_id) {
        lecture = await this.lectureRepository.findOne({
          relations: {
            prof: true,
            records: {
              years: true,
              semesters: true,
              user: true,
              prof: true,
            },
          },
          where: {
            id: lecture_id,
            prof: {
              id: prof_id,
            },
          },
        });
      } else {
        lecture = await this.lectureRepository.findOne({
          relations: {
            prof: true,
            records: {
              years: true,
              semesters: true,
              user: true,
              prof: true,
            },
          },
          where: {
            id: lecture_id,
          },
        });
      }

      try {
        const filter = lecture.records;
        const obj_list = [];
        for (var i = 0; i < filter.length; i++) {
          if (prof_id) {
            if (filter[i].prof.id != prof_id) {
              continue;
            }
          }
          const parse: any = filter[i];
          const obj = {
            record_id: parse.id,
            difficulty: parse.difficulty,
            strength: parse.strength,
            helpful: parse.helpful,
            interest: parse.interest,
            lots: parse.lots,
            satisfy: parse.satisfy,
            review: parse.review,
            evaluation: parse.evaluation,
            semester: parse.semesters.id,
            year: parse.years.year,
            writer_id: parse.user.id,
            prof_id: parse.prof.id,
            user_id: parse.user.id,
          };
          obj_list.push(obj);
        }

        return obj_list;
      } catch (err) {
        throw new NotFoundException('There is no any records.');
      }
    }
  }

  /**강의 아이디 조회 API*/
  async getLectureId(lecture_code: string, prof_id: number) {
    const found = await this.lectureRepository.find({
      select: {
        id: true,
        lecture_code: true,
      },
      relations: {
        prof: true,
      },
      where: {
        lecture_code: await this.toListForm(lecture_code),
        prof: {
          id: prof_id,
          lectures: false,
        },
      },
    });

    if (found.length == 0) {
      throw new NotFoundException(
        `해당되는 강의 코드의 강의가 없습니다. 강의코드 : ${lecture_code}`,
      );
    }
    return await this.json_filter(found);
  }

  /**강의 추가 API*/
  //기존에 없는 강의를 추가할 떄, 교수자를 추가할 때, must be set the professror data before use this API.
  async createLecture(createLectureDto: CreateLectureDto): Promise<any> {
    //Promise<Lecture>
    const { lecture_name, lecture_code, prof_id } = createLectureDto;

    const find_prof = await this.profRepository.findOne({
      where: {
        id: prof_id,
      },
    });

    const find_lecture = await this.lectureRepository.findOne({
      where: {
        lecture_code: await this.toListForm(lecture_code),
        lecture_name: lecture_name,
      },
      relations: {
        prof: true,
      },
    });

    if (!find_prof) {
      throw new NotFoundException(`없는 교수 ID(${prof_id}) 입니다.`);
    } else {
      if (find_lecture) {
        if (!find_lecture.prof.some((p) => p.id === prof_id)) {
          find_lecture.prof.push(find_prof);
        } else {
          throw new ConflictException(
            `이미 등록된 강의(${lecture_name})-교수(${find_prof.prof_name}) 입니다.`,
          );
        }
        await this.lectureRepository.save(find_lecture);
      } else {
        const lecture1 = new Lecture();
        lecture1.lecture_code = await this.toListForm(lecture_code);
        lecture1.lecture_name = lecture_name;
        lecture1.prof = [find_prof];
        await this.lectureRepository.save(lecture1);
      }
    }

    return 'success';
  }

  async getAll(): Promise<Lecture[]> {
    return this.lectureRepository.find({
      select: {
        id: true,
        lecture_code: true,
        lecture_name: true,
        prof: true,
      },
      relations: {
        prof: true,
      },
    });
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
  async json_filter(found: any): Promise<any> {
    const src = JSON.stringify(found);
    const src1 = src.split(',');
    const src_id1 = src1[0];
    const src_id = src_id1.split(':')[1];
    const src_code1 = src1[1].split(':');
    const src_code = src_code1[1].toString().split("'")[1];
    const src_prof_id = src1[2].split(':')[2];
    const src_prof_name = src1[3].split(':')[1].split('"')[1];
    const obj = {
      id: src_id,
      lecture_code: src_code,
      prof_id: src_prof_id,
      prof_name: src_prof_name,
    };
    var json = JSON.stringify(obj);
    return json;
  }

  /**강의 id 조회로 삭제 기능 */
  async remove(id: number): Promise<void> {
    await this.lectureRepository.delete(id);
  }

  async DeleteLecture(id: number): Promise<void> {
    const result = await this.lectureRepository.delete(id);
  }
}
