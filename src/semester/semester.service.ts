import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Semester } from './entity/semester.entity';
import { Repository } from 'typeorm';
import { SemesterDto } from './dto/semester.dto';

@Injectable()
export class SemesterService {
    constructor (
        @InjectRepository(Semester)
        private semesterRepository : Repository<Semester>
    ){}


    async push(semesterDto : SemesterDto) : Promise<any>{
        const {semester}= semesterDto;
        const found = await this.semesterRepository.findOneBy({semester : semester});
        console.log(found)
        if(!found)
        {
            const result =  await this.semesterRepository.create({
                semester,
            });
            await this.semesterRepository.save(result);
            return result
        }
    }
}
