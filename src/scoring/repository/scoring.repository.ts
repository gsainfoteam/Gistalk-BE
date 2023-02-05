import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Lecture } from 'src/lecture/entity/lecture.entity';
import { Entity, Repository } from 'typeorm';
import { Scoring } from '../entity/scoring.entity';

@Injectable()
export class scoringrepo {
  constructor(
    @InjectRepository(Scoring)
    private scoringRepository: Repository<Scoring>,
    @InjectRepository(Lecture)
    private lectureRepository: Repository<Lecture>,
  ) {}

  async scoring(lecture: any, people: number, main_lecture_id: number) {
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

    total_score =
      (diff_sum + stren_sum + help_sum + inter_sum + lots_sum + sati_sum) / 6;
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

    const scoring = new Scoring();

    scoring.lecture_id = main_lecture_id * 1;
    scoring.diff_aver = diff_sum;
    scoring.stren_aver = stren_sum;
    scoring.help_aver = help_sum;
    scoring.inter_aver = inter_sum;
    scoring.lots_aver = lots_sum;
    scoring.sati_aver = sati_sum;
    scoring.people = people;
    scoring.total_score = total_score.toPrecision(2);
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
  }
}
