import {
  IsBoolean,
  IsInt,
  IsNumberString,
  IsPositive,
  Length,
  Max,
} from 'class-validator';

export class CreateRecordDto {
  @IsInt()
  @IsPositive()
  @Max(5)
  readonly difficulty: number;

  @IsInt()
  @IsPositive()
  @Max(5)
  readonly strength: number;

  @IsInt()
  @IsPositive()
  @Max(5)
  readonly helpful: number;

  @IsInt()
  @IsPositive()
  @Max(5)
  readonly interest: number;

  @IsInt()
  @IsPositive()
  @Max(5)
  readonly lots: number;

  @IsInt()
  @IsPositive()
  @Max(5)
  readonly satisfy: number;

  @Length(15, 255)
  readonly review: string;

  @IsInt()
  @IsPositive()
  readonly lecture_id: number;

  @IsInt()
  @IsPositive()
  readonly prof_id: number;

  @IsInt()
  @IsPositive()
  @Max(4)
  readonly semester_id: number;

  @IsNumberString()
  @Length(4, 4)
  readonly year: string;

  readonly recommend?: number;
}
