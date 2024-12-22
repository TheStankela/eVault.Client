import { Injectable } from '@angular/core';
import { ToasterService } from './toaster.service';
import { Result } from '../common/result';
import { ResultMessages } from '../common/constants';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  constructor(public toasterService: ToasterService) { }

  public handleError(result: HttpErrorResponse): void {
    if(result.error || result.status != 200){
      let message: string;

      console.log(result)

      switch (result.status) {
        case 400:
          message = ResultMessages.BadRequest;
          break;
        case 401:
          message = ResultMessages.Unauthorized;
          break;
        case 403:
          message = ResultMessages.Forbidden;
          break;
        case 404:
          message = ResultMessages.NotFound;
          break;
        case 409:
          message = result?.error.message;
          break;
        case 500:
          message = ResultMessages.InternalServerError;
          break;
        default:
          message = ResultMessages.UnexpectedError;
          break;
      }

      this.toasterService.error(message);
    }
  }
}
