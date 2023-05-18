export class CreateAssignmentDto { 
    
    readonly record_id: number;
  
    readonly practice: boolean;
  
    readonly report: boolean;
  
    readonly project: boolean;

    readonly other: boolean;
  }