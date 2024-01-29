export class LoginUserDto {
  readonly code: string;

  readonly type?: 'dev' | 'stg';

  readonly state?: string;
}
