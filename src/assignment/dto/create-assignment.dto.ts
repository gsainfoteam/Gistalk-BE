export class CreateAssignmentDto {

  readonly lecture_id: number;

  readonly semester_id: number;

  readonly year: string;
  
  readonly assignment_EV: string;

  readonly practice: boolean;

  readonly report: boolean;

  readonly project: boolean;

  readonly other: boolean;


}