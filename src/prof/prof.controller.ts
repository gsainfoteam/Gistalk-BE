import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateProfDto } from './dto/create-prof.dto';
import { UpdateProfDto } from './dto/update-des-prof.dto';
import { Prof } from './entity/prof.entity';
import { ProfService } from './prof.service';

@Controller('profs')
export class ProfController {
  constructor(private readonly profService: ProfService) {}

  //모든 교수 정보 가져오기 API
  @Get('all')
  getAll(): Promise<Prof[]> {
    return this.profService.getAll();
  }

  //교수 id로 교수 별 개설강좌 가져오기 API
  @Get('get_:id')
  getProfInfo(@Param('id') id: number): Promise<any> {
    return this.profService.getProfInfo(id);
  }

  //교수 추가 API
  @Post('add')
  createProf(@Body() profData: CreateProfDto): Promise<Prof> {
    return this.profService.createProf(profData);
  }

  //교수 삭제 API
  @Delete("delete:id")
  DeleteProf(@Param('id') id : number): Promise<any>
  {
    return this.profService.DeleteProf(id);
  }
}
