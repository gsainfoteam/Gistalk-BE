import { Body, Controller, Post } from '@nestjs/common';
import { SemesterService } from './semester.service';
import { SemesterDto } from './dto/semester.dto';

@Controller('semester')
export class SemesterController {
    constructor (private readonly semesterService : SemesterService) {}

    @Post('push')
    psuh(@Body() semesterDto: SemesterDto) : Promise<any>{
        return this.semesterService.push(semesterDto);
    }

    
}
