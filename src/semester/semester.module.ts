import { Module } from '@nestjs/common';
import { SemesterController } from './semester.controller';
import { SemesterService } from './semester.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Semester } from './entity/semester.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Semester]), UserModule],
  controllers: [SemesterController],
  providers: [SemesterService]
})
export class SemesterModule {}
