import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateProfDto } from './dto/create-prof.dto';
import { UpdateProfDto } from './dto/update-des-prof.dto';
import { Prof } from './entity/prof.entity';
import { ProfService } from './prof.service';

@Controller('profs')
export class ProfController {
  constructor(private readonly profService: ProfService) {}

  @Get('all')
  getAll(): Promise<Prof[]> {
    return this.profService.getAll();
  }

  @Get('get_:id')
  getProfInfo(@Param('id') id: number): Promise<any> {
    return this.profService.getProfInfo(id);
  }

  @Post('add')
  createProf(@Body() profData: CreateProfDto): Promise<Prof> {
    return this.profService.createProf(profData);
  }
}
