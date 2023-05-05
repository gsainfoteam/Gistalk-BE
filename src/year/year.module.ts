import { Module } from '@nestjs/common';
import { YearController } from './year.controller';
import { YearService } from './year.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Year } from './entity/year.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports : [TypeOrmModule.forFeature([Year]), UserModule],
  controllers: [YearController],
  providers: [YearService]
})
export class YearModule {}
