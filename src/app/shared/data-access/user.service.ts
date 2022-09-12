import { Injectable } from '@angular/core';
import { delay, map, of, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  user$ = of('Josh');
  userDelayed$ = of('Josh').pipe(delay(3000));
  userErrored$ = of('Josh').pipe(
    delay(3000),
    map(() => {
      throw 'Oops';
    }),
    shareReplay(1)
  );
}
