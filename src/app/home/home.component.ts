import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  catchError,
  combineLatest,
  EMPTY,
  ignoreElements,
  interval,
  map,
  of,
  startWith,
} from 'rxjs';
import { UserService } from '../shared/data-access/user.service';

@Component({
  selector: 'app-home',
  template: `
    <ng-container *ngIf="vm$ | async as vm">
      <h2>Home page</h2>
      <h3>{{ vm.greeting }}</h3>
      <p *ngIf="vm.user; else userLoading">Welcome back {{ vm.user }}</p>
      <p>{{ vm.count }}</p>

      <ng-template #userLoading>
        <p>Loading...</p>
        <p *ngIf="vm.userError">There was an error: {{ vm.userError }}</p>
      </ng-template>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  greeting$ = of('Hello!');
  count$ = interval(500);
  userError$ = this.userService.userErrored$.pipe(
    ignoreElements(),
    startWith(null),
    catchError((err) => of(err))
  );

  vm$ = combineLatest([
    this.greeting$,
    this.count$,
    this.userService.userErrored$.pipe(
      startWith(null),
      catchError(() => EMPTY)
    ),
    this.userError$,
  ]).pipe(
    map(([greeting, count, user, userError]) => ({
      greeting,
      count,
      user,
      userError,
    }))
  );

  constructor(private userService: UserService) {}
}

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomeComponent,
      },
    ]),
  ],
})
export class HomeComponentModule {}
