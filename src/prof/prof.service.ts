import {
  All,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LectureService } from 'src/lecture/lecture.service';
import { Scoring } from 'src/scoring/entity/scoring.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateProfDto } from './dto/create-prof.dto';
import { UpdateProfDto } from './dto/update-des-prof.dto';
import { Prof } from './entity/prof.entity';

@Injectable()
export class ProfService {
  constructor(
    @InjectRepository(Prof)
    private profRepository: Repository<Prof>,
    @InjectRepository(Scoring)
    private scoringRepository: Repository<Scoring>,
  ) {}

  async getProfName(prof_name: string): Promise<Prof> {
    const found = await this.profRepository.findOneBy({ prof_name: prof_name });
    return found;
  }

  //교수별 개설 강좌 조회 API
  async getProfInfo(prof_id: number): Promise<any> {
    const found = await this.profRepository.findOneBy({ id: prof_id });

    if (!found) {
      throw new NotFoundException(
        `ID에 할당된 교수가 없습니다 ID : ${prof_id}`,
      );
    } else {
      const prof = await this.profRepository.findOne({
        select: {
          id: true,
          lectures: true,
          prof_name: true,
        },
        relations: {
          lectures: true,
        },
        where: {
          id: prof_id,
        },
      });

      return prof;
    }

    //await this.lectureService.scoring(prof)
  }

  //교수 추가 API
  async createProf(createProfDto: CreateProfDto): Promise<string> {
    const { prof_name } = createProfDto;
    const found = await this.getProfName(prof_name);

    if (!found) {
      const prof = await this.profRepository.create({
        prof_name,
      });
      await this.profRepository.save(prof);
      return 'success';
    } else {
      throw new ConflictException(
        `중복된 교수명입니다. Prof name : ${prof_name}`,
      );
    }
  }

  async DeleteProf(id: number): Promise<void> {
    const result = await this.profRepository.delete(id);
  }

  //교수 ID 검색 API
  async searchProf(id: number): Promise<string> {
    const found = await this.profRepository.findOneBy({ id: id });

    if (!found) {
      return '';
    } else {
      const prof = await this.profRepository.findOne({
        select: {
          id: true,
          lectures: true,
          prof_name: true,
        },
        relations: {
          lectures: true,
        },
        where: {
          id: id,
        },
      });
      return prof;
    }
  }
}
