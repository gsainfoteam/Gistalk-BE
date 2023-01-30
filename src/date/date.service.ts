import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDate } from './dto/create-date.dto';
import { Lecture_Date } from './entity/date.entity';

@Injectable()
export class DateService {
    constructor(
        @InjectRepository(Lecture_Date)
        private lecture_dateRepository : Repository<Lecture_Date>,
    ) {}

    async SerchDuplicateDate(data : CreateDate): Promise<Lecture_Date>
    {
        const found = await this.lecture_dateRepository.findOne({
            where : {
                date : data.date
            }
        })

        return found
    }
    async CreateDate(data : CreateDate): Promise<any>
    {
        const found = await this.SerchDuplicateDate(data);

        if(!found)
        {
            const CreateDate = await this.lecture_dateRepository.create({
                date : data.date
            });
            await this.lecture_dateRepository.save(CreateDate);
            return CreateDate
        }
        else
        {
            throw new NotFoundException(`이미 등록된 정보입니다.`)
        }
    }
}
