import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Lecture } from 'src/lecture/entity/lecture.entity';
import { Repository } from 'typeorm';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { Record } from './entity/record.entity';

@Injectable()
export class RecordService {
    constructor (
        @InjectRepository(Record)
        private recordRepository : Repository<Record>,
        @InjectRepository(Lecture)
        private lectureRepository : Repository<Lecture>
    ) {}

    //모든 강의 평가 조회 API
    async getAll(): Promise<Record[]>
    {
        return this.recordRepository.find({});
    }

    //강의 평가 추가 API
    async createRecord(createrecorddto : CreateRecordDto) : Promise<Record> 
    {   
        const { difficulty, strength, helpful, interest, lots, satisfy, oneline, user, lecture_id } = createrecorddto;

        const found = await this.lectureRepository.findOneBy({id : lecture_id});

        const found_user = await this.recordRepository.findOne({
            relations : {
                lecture : true
            },
            where : {
                user_id : user,
                lecture : {
                    id : lecture_id
                }
            }
            }); //임시방편 추후 유저로그인 기능 구현필요

    
        if(found_user)
        {
            throw new ConflictException(`이미 강의 평가를 작성한 유저입니다. 유저명 :  ${user}`);
        }
        else
        {
            if(found)
            {
                const record = new Record()
                record.difficulty = difficulty
                record.strength = strength
                record.helpful = helpful
                record.interest = interest
                record.lots = lots
                record.satisfy = satisfy
                record.oneline = oneline
                record.user_id = user
                record.lecture = await this.lectureRepository.findOne({
                        relations: {
                            records : true
                        },
                        where : {
                            id : lecture_id
                        }
                        
                    })
    
                await this.recordRepository.manager.save(record)
                return record
            }
            else
            {
              throw new NotFoundException(`해당되는 id : ${lecture_id} 강의가 없습니다.`);
            }
        }

        
    }

    //강의평가 수정 API
    async updateRecord(lecture_id : number, user_id: string, modify : UpdateRecordDto): Promise<any>
    {
        const { difficulty,strength, helpful, interest, lots, satisfy, oneline } = modify;
        
        const record = await this.recordRepository.findOne({
            relations : {
                lecture : true
            },
            where : {
                user_id : user_id,
                lecture : {
                    id : lecture_id
                }
            }
        })
        
        record.difficulty = difficulty
        record.strength = strength
        record.helpful = helpful
        record.interest = interest
        record.lots = lots
        record.satisfy = satisfy
        record.oneline = oneline
        await this.recordRepository.save(record);
        return record
    }
}
