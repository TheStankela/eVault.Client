import { HttpStatusCode } from '@angular/common/http';

export class Result<T> {
  data?: T;
  error?: Error;
  resultType: ResultType;
  statusCode: HttpStatusCode;
  isSuccess: boolean;
}

export enum ResultType{
    NotSet = 0, 
    Success = 1,
    Failure = 2,
    NotFound = 3,
    BadRequest = 4,
    Conflict = 5
}
