import { Body, Controller, Post } from '@nestjs/common';
import { DateService } from './date.service';
import { CreateDate } from './dto/create-date.dto';

@Controller('date')
export class DateController {
    constructor(private dateservice : DateService) {}

    @Post('/add')
    CreateDate(@Body() data : CreateDate): Promise<any>
    {
        return this.dateservice.CreateDate(data);
    }
}
