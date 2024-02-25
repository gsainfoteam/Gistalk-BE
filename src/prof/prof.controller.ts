import {
  Body,
  Query,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateProfDto } from './dto/create-prof.dto';
import { ProfService } from './prof.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/user/auth/auth.guard';
import { SearchProfDto } from './dto/search-prof.dto';

@ApiTags('PROF')
@Controller('profs')
export class ProfController {
  constructor(private readonly profService: ProfService) {}

  //** 교수별 개설 강좌 조회 API */
  @Get('get/:id')
  getProfInfo(@Param('id') id: number): Promise<any> {
    return this.profService.getProfInfo(id);
  }

  //** 교수추가 API 관리자용 */
  @UseGuards(AuthGuard)
  @Post('add')
  createProf(@Body() profData: CreateProfDto): Promise<string> {
    return this.profService.createProf(profData);
  }

  //** 교수 삭제 API 관리자용 */
  @UseGuards(AuthGuard)
  @Delete('delete:id')
  DeleteProf(@Param('id') id: number): Promise<any> {
    return this.profService.DeleteProf(id);
  }

  //** 교수 ID 검색 API 관리자용 */
  @UseGuards(AuthGuard)
  @Get('search')
  searchProf(@Query() query): Promise<string> {
    return this.profService.searchProf(query.name);
  }

}
