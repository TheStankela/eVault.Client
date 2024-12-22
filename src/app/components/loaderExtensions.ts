import {BehaviorSubject, Observable, finalize} from 'rxjs';

declare module 'rxjs' {
  export interface Observable<T> {
    WithLoader(this: Observable<T> ,subject: BehaviorSubject<boolean>): Observable<T>;
  }
}

Observable.prototype.WithLoader =  function (subject: BehaviorSubject<boolean>) {
  subject.next(true);

  return this.pipe(
    finalize(() => {
      subject.next(false);
    })
  );
}