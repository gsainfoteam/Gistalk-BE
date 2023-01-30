import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { RecordService } from './record.service';

@Controller('records')
export class RecordController {
    constructor( private readonly recordservice : RecordService) {}

    //모든 강의평가 가져오기
    @Get('all')
    getAll(): Promise<any>
    {
        return this.recordservice.getAll();
    }
    
    //강의평가 추가
    @Post('add')
    createRecord(@Body() createrecorddto : CreateRecordDto ) : Promise<any>
    {
        return this.recordservice.createRecord(createrecorddto);
    }

    //강의평가수정
    @Patch(':user_id/:lecture_id/modify')
    updateRecord(
        @Param('lecture_id') lecture_id : number,
        @Param('user_id') user_id : string,
        @Body() modify : UpdateRecordDto
    ): Promise<any>
    {
        return  this.recordservice.updateRecord(lecture_id, user_id, modify);   
    }
}
