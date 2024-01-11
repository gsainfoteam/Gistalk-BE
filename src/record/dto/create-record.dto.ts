import {
  IsInt,
  IsNumberString,
  IsPositive,
  IsString,
  Length,
  Max,
  MaxLength,
  max,
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

  readonly review: string;

  @IsInt()
  @IsPositive()
  @Max(5)
  readonly lecture_id: number;

  @IsInt()
  @IsPositive()
  @Max(1)
  readonly semester_id: number;

  @IsNumberString()
  @MaxLength(255)
  readonly year: string;

  readonly user_id: number;
}
