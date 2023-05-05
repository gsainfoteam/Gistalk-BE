import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Year } from './entity/year.entity';
import { Repository } from 'typeorm';
import { YearDto } from './dto/year.dto';

@Injectable()
export class YearService {
    constructor(
        @InjectRepository(Year)
        private yearRepository : Repository<Year>
    ) {}

    async push(yearDto : YearDto): Promise<any> {
    const {year}= yearDto;
    const found = await this.yearRepository.findOneBy({year : year});
    console.log(found)
    if(!found)
    {
        const result =  await this.yearRepository.create({
            year,
        });
        await this.yearRepository.save(result);
        return result
    }
}
}
