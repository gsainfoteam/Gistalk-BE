import { Module } from '@nestjs/common';
import { YearController } from './year.controller';
import { YearService } from './year.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Year } from './entity/year.entity';

@Module({
  imports : [TypeOrmModule.forFeature([Year])],
  controllers: [YearController],
  providers: [YearService]
})
export class YearModule {}
