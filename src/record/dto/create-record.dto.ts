export class CreateRecordDto {
  readonly difficulty: number;

  readonly strength: number;

  readonly helpful: number;

  readonly interest: number;

  readonly lots: number;

  readonly satisfy: number;
  //review
  readonly oneline: string;

  readonly user: string; //나중에 제거

  readonly lecture_id: number;

  readonly semester_id : number;

}
