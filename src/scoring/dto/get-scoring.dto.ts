import {
  IsBoolean,
  IsInt,
  IsNumberString,
  IsPositive,
  Length,
  Max,
} from 'class-validator';

export class GetScoringDto {
  @IsInt()
  @IsPositive()
  readonly lecture_id: number;
}
