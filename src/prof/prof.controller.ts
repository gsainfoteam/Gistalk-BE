import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateProfDto } from './dto/create-prof.dto';
import { UpdateProfDto } from './dto/update-des-prof.dto';
import { Prof } from './entity/prof.entity';
import { ProfService } from './prof.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('PROF')
@Controller('profs')
export class ProfController {
  constructor(private readonly profService: ProfService) {}

  @Get('get/:id')
  getProfInfo(@Param('id') id: number): Promise<any> {
    return this.profService.getProfInfo(id);
  }

  @Post('add')
  createProf(@Body() profData: CreateProfDto): Promise<string> {
    return this.profService.createProf(profData);
  }

  @Delete('delete:id')
  DeleteProf(@Param('id') id: number): Promise<any> {
    return this.profService.DeleteProf(id);
  }
}
