import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { SemesterService } from './semester.service';
import { SemesterDto } from './dto/semester.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('semester')
@UseGuards(AuthGuard())
export class SemesterController {
    constructor (private readonly semesterService : SemesterService) {}

    @Post('push')
    psuh(@Body() semesterDto: SemesterDto) : Promise<any>{
        return this.semesterService.push(semesterDto);
    }

    
}
