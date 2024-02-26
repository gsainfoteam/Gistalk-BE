import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Lecture } from 'src/lecture/entity/lecture.entity';
import { Repository } from 'typeorm';
import { Scoring } from './entity/scoring.entity';
import { Prof } from 'src/prof/entity/prof.entity';
import { number } from 'joi';
import { GetScoringDto } from './dto/get-scoring.dto';

@Injectable()
export class ScoringService {
  constructor(
    @InjectRepository(Scoring)
    private scoringRepository: Repository<Scoring>,
    @InjectRepository(Lecture)
    private lectureRepository: Repository<Lecture>,
    @InjectRepository(Prof)
    private profRepository: Repository<Prof>,
  ) {}

  //강의 id에 따라서 저장된 점수 가져오는 API
  async getScoring(lecture_id: number, prof_id?: number): Promise<any> {
    const lectureid = Number(lecture_id);
    this.getLectureInfo(lecture_id);
    const lecture = await this.getLectureInfo(lectureid);
    const people = lecture.records.length;
    //console.log("총 평가 인원 " + people);

    if (!people) {
      throw new NotFoundException(`강의평이 없습니다.`);
    } else {
      try {
        const score = await this.scoringRepository.findOne({
          where: {
            lecture: {
              id: lecture_id,
            },
            prof: {
              id: prof_id,
            },
          },
        });
        let modifiedScore = JSON.parse(JSON.stringify(score));

        modifiedScore.prof_id = modifiedScore.prof.id;
        delete modifiedScore.prof;
        return modifiedScore;
      } catch (e) {
        throw new NotFoundException(
          "Can't find lecture-prof values you given.",
        );
      }
    }
  }

  async getTotalScoring(lecture_id: number): Promise<any> {
    const lectureid = lecture_id;
    this.getLectureInfo(lectureid);
    const lecture = await this.getLectureInfo(lectureid);
    const people = lecture.records.length;
    //console.log("총 평가 인원 " + people);

    if (!people) {
      throw new NotFoundException(`강의평이 없습니다.`);
    } else {
      try {
        const score = await this.scoringRepository.find({
          where: {
            lecture_id: lectureid,
          },
        });
        let modifiedScore = JSON.parse(JSON.stringify(score));
        let people = 0;
        let diff_aver = 0;
        let stren_aver = 0;
        let help_aver = 0;
        let inter_aver = 0;
        let lots_aver = 0;
        let sati_aver = 0;
        let good = 0;
        let bad = 0;
        for (var i = 0; i < modifiedScore.length; i++) {
          const parse: any = modifiedScore[i];
          people += parse.people;
          diff_aver += parse.diff_aver;
          stren_aver += parse.stren_aver;
          help_aver += parse.help_aver;
          inter_aver += parse.inter_aver;
          lots_aver += parse.lots_aver;
          sati_aver += parse.sati_aver;
          good += parse.good;
          bad += parse.bad;
        }
        const length = modifiedScore.length;
        const obj = {
          lecture_id: modifiedScore[0].lecture_id,
          people: people,
          diff_aver: diff_aver / length,
          stren_aver: stren_aver / length,
          help_aver: help_aver / length,
          inter_aver: inter_aver / length,
          lots_aver: lots_aver / length,
          sati_aver: sati_aver / length,
          good: good,
          bad: bad,
        };
        return obj;
      } catch (e) {
        throw new NotFoundException(
          "Can't find lecture-prof values you given.",
        );
      }
    }
  }

  //강의 여부 확인 함수
  async getLectureInfo(lecture_id: number, prof_id?: number): Promise<any> {
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
        `ID에 할당된 강의가 없습니다 ID : ${lecture_id}`,
      );
    } else {
      const lecture = await this.lectureRepository.findOne({
        relations: {
          records: true,
          prof: true,
        },
        where: {
          id: lecture_id,
          prof: {
            id: prof_id,
          },
          records: {
            prof: {
              id: prof_id,
            },
          },
        },
      });
      if (lecture === null) {
        throw new NotFoundException('아직 작성된 강의평이 없습니다.');
      } else {
        return lecture;
      }
    }
  }

  // 강의 평점 계산 & 6개 평가 지표 API
  async scoring(main_lecture_id: number, prof_id?: number): Promise<any> {
    const lecture = await this.getLectureInfo(
      Number(main_lecture_id),
      Number(prof_id),
    ); //1곱하지말고 parseInt pipe만드는게 좋을듯
    const people = lecture.records.length;
    const found = await this.scoringRepository.findOne({
      where: {
        lecture_id: Number(main_lecture_id),
        lecture: { id: Number(main_lecture_id) },
        prof: { id: prof_id },
      },
    });
    if (found) {
      return 'aleady calculated lecture.';
    }
    if (people) {
      await this.scoringFuntion(
        'post',
        lecture,
        people,
        main_lecture_id,
        prof_id,
      );
    }

    return 'success';
  }

  async updateScoring(lecture_id: number, prof_id?: number): Promise<any> {
    const lectureId = Number(lecture_id);
    //const fuond = await this.getLectureInfo(lectureId, prof_id);
    //console.log(fuond)

    const confirm = await this.scoringRepository.findOne({
      relations: {
        prof: true,
      },
      where: {
        lecture: {
          id: lectureId,
        },
        prof: {
          id: prof_id,
        },
      },
    });
    if (confirm) {
      const lecture = await this.getLectureInfo(lectureId, prof_id);
      //console.log('\n confirm in lecture \n', lecture);

      const people = lecture.records.length;
      this.scoringFuntion('patch', lecture, people, lectureId, prof_id);
    }
  }

  //점수 계산 함수 나중에 따로 레퍼지토리 파서 관리 필요
  async scoringFuntion(
    type: string,
    lecture: any,
    people: number,
    main_lecture_id: number,
    prof_id?: number,
  ) {
    // let prof_id = prof_i1d;
    let i: number;
    let diff_sum = 0;
    let stren_sum = 0;
    let help_sum = 0;
    let inter_sum = 0;
    let lots_sum = 0;
    let sati_sum = 0;
    let good = 0;
    let bad = 0;
    let total_score = 0;
    for (i = 0; i < people; i++) {
      const diff = lecture.records[i].difficulty;
      const stren = lecture.records[i].strength;
      const help = lecture.records[i].helpful;
      const inter = lecture.records[i].interest;
      const lots = lecture.records[i].lots;
      const sati = lecture.records[i].satisfy;
      if (lecture.records[i].recommend == 1) {
        good = good + 1;
      } else if (lecture.records[i].recommend == 0) {
        bad = bad + 1;
      }

      diff_sum = diff_sum + diff;
      stren_sum = stren_sum + stren;
      help_sum = help_sum + help;
      inter_sum = inter_sum + inter;
      lots_sum = lots_sum + lots;
      sati_sum = sati_sum + sati;
    }

    diff_sum = diff_sum / i;
    stren_sum = stren_sum / i;
    help_sum = help_sum / i;
    inter_sum = inter_sum / i;
    lots_sum = lots_sum / i;
    sati_sum = sati_sum / i;

    // total_score =
    //   (diff_sum + stren_sum + help_sum + inter_sum + lots_sum + sati_sum) / 6;
    const found = await this.lectureRepository.findOne({
      relations: {
        records: true,
        prof: true,
      },
      select: {
        id: true,
        lecture_code: true,
        lecture_name: true,
      },
      where: {
        id: main_lecture_id,
        records: {
          prof: {
            id: prof_id,
          },
        },
      },
    });
    //DB 저장
    //const int_lecture_id = Number(lecture_id);
    if (type == 'post') {
      const scoring = new Scoring();

      scoring.lecture_id = main_lecture_id * 1;
      scoring.diff_aver = diff_sum;
      scoring.stren_aver = stren_sum;
      scoring.help_aver = help_sum;
      scoring.inter_aver = inter_sum;
      scoring.lots_aver = lots_sum;
      scoring.sati_aver = sati_sum;
      scoring.people = people;
      scoring.good = good;
      scoring.bad = bad;
      // scoring.total_score = total_score.toPrecision(2);
      scoring.lecture = await this.lectureRepository.findOne({
        relations: {
          records: true,
          prof: true,
        },
        where: {
          id: main_lecture_id * 1,
          prof: {
            id: prof_id,
          },
        },
      });
      scoring.prof = await this.profRepository.findOne({
        relations: {
          records: true,
          lectures: true,
        },
        where: {
          id: prof_id,
          lectures: {
            id: Number(main_lecture_id),
          },
        },
      });
      await this.scoringRepository.manager.save(scoring);
      return scoring;
    } else if (type == 'patch') {
      const scoring = await this.scoringRepository.findOne({
        where: {
          lecture: {
            id: main_lecture_id,
          },
          prof: {
            id: prof_id,
          },
        },
      });
      scoring.lecture_id = main_lecture_id * 1;
      scoring.diff_aver = diff_sum;
      scoring.stren_aver = stren_sum;
      scoring.help_aver = help_sum;
      scoring.inter_aver = inter_sum;
      scoring.lots_aver = lots_sum;
      scoring.sati_aver = sati_sum;
      scoring.people = people;
      scoring.good = good;
      scoring.bad = bad;
      scoring.lecture = await this.lectureRepository.findOne({
        relations: {
          records: true,
          prof: true,
        },
        where: {
          id: main_lecture_id * 1,
          prof: {
            id: prof_id,
          },
        },
      });
      scoring.prof = await this.profRepository.findOne({
        relations: {
          records: true,
          lectures: true,
        },
        where: {
          id: prof_id,
          lectures: {
            id: Number(main_lecture_id),
          },
        },
      });
      // scoring.total_score = total_score.toPrecision(2);
      await this.scoringRepository.save(scoring);
      return scoring;
    }
  }
}
