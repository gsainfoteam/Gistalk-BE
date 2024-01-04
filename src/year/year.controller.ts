import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { YearService } from './year.service';
import { YearDto } from './dto/year.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('year')
//@UseGuards(AuthGuard())
export class YearController {
  constructor(private readonly yearService: YearService) {}

  @Post('push')
  push(@Body() yearDto: YearDto): Promise<any> {
    return this.yearService.push(yearDto);
  }
}
