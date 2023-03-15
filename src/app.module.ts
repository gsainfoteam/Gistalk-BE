import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lecture } from './lecture/entity/lecture.entity';
import { LectureModule } from './lecture/lecture.module';
import { ProfModule } from './prof/prof.module';
import { Prof } from './prof/entity/prof.entity';
import { RecordModule } from './record/record.module';
import { Record } from './record/entity/record.entity';
import { ScoringModule } from './scoring/scoring.module';
import { Scoring } from './scoring/entity/scoring.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import * as Joi from 'joi';
import { User } from './user/entity/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_HOST: Joi.string().required(),
        DATABASE_USER: Joi.string().required(),
        DATABASE_DBNAME: Joi.string().required(),
        DATABASE_PASSWORD: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'mysql',
          host: configService.get('DATABASE_HOST'),
          port: 3306,
          username: configService.get('DATABASE_USER'),
          password: configService.get('DATABASE_PASSWORD'),
          database: configService.get('DATABASE_DBNAME'),
          entities: [Lecture, Prof, Record, Scoring, User],
          synchronize: true, //when push change  false
        };
      },
    }),
    LectureModule,
    ProfModule,
    RecordModule,
    ScoringModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
