import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Lecture } from 'src/lecture/entity/lecture.entity';
import { Repository } from 'typeorm';
import { Scoring } from './entity/scoring.entity';

@Injectable()
export class ScoringService {
  constructor(
    @InjectRepository(Scoring)
    private scoringRepository: Repository<Scoring>,
    @InjectRepository(Lecture)
    private lectureRepository: Repository<Lecture>,
  ) {}

  //강의 id에 따라서 저장된 점수 가져오는 API
  async getScoring(lecture_id: number): Promise<any> {
    this.getLectureInfo(lecture_id);
    const lecture = await this.getLectureInfo(lecture_id * 1);
    const people = lecture.records.length;
    //console.log("총 평가 인원 " + people);

    if (!people) {
      throw new NotFoundException(`강의평이 없습니다.`);
    } else {
      const score = await this.scoringRepository.findOne({
        where: {
          lecture_id: lecture_id,
        },
      });

      return score;
    }
  }

  //강의 여부 확인 함수
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

  // 강의 평점 계산 & 육각형 API
  async scoring(main_lecture_id: number): Promise<any> {
    const lecture = await this.getLectureInfo(main_lecture_id * 1); //1곱하지말고 parseInt pipe만드는게 좋을듯
    const people = lecture.records.length;
    const found = await this.scoringRepository.findOne({
      where: {
        lecture_id: main_lecture_id * 1,
      },
    });
    if (found) {
      throw new NotFoundException(
        `해당 강의는 이미 최소 1번 이상 계산되었습니다`,
      );
    }
    if (people) {
      this.scoringFuntion('post', lecture, people, main_lecture_id);
    }

    return 'success';
  }

  async updateScoring(lecture_id: number): Promise<any> {
    const fuond = await this.getLectureInfo(lecture_id);
    //console.log(fuond)

    const confirm = await this.scoringRepository.findOne({
      where: {
        lecture: {
          id: lecture_id,
        },
      },
    });
    if (confirm) {
      const lecture = await this.getLectureInfo(lecture_id * 1);
      const people = lecture.records.length;
      this.scoringFuntion('patch', lecture, people, lecture_id);
    }
  }

  //점수 계산 함수 나중에 따로 레퍼지토리 파서 관리 필요
  async scoringFuntion(
    type: string,
    lecture: any,
    people: number,
    main_lecture_id: number,
  ) {
    let i: number;
    let diff_sum = 0;
    let stren_sum = 0;
    let help_sum = 0;
    let inter_sum = 0;
    let lots_sum = 0;
    let sati_sum = 0;
    let total_score = 0;
    for (i = 0; i < people; i++) {
      const diff = lecture.records[i].difficulty;
      const stren = lecture.records[i].strength;
      const help = lecture.records[i].helpful;
      const inter = lecture.records[i].interest;
      const lots = lecture.records[i].lots;
      const sati = lecture.records[i].satisfy;

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
      select: {
        id: true,
        lecture_code: true,
        lecture_name: true,
      },
      where: {
        id: main_lecture_id,
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
      // scoring.total_score = total_score.toPrecision(2);
      scoring.lecture = await this.lectureRepository.findOne({
        relations: {
          records: true,
        },
        where: {
          id: main_lecture_id * 1,
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
      // scoring.total_score = total_score.toPrecision(2);
      await this.scoringRepository.save(scoring);
      return scoring;
    }
  }
}
