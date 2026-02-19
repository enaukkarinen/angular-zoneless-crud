import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, of } from 'rxjs';

import * as AccountActions from './accounts.actions';
import { BankAccountService } from '@app/core/bank-account/bank-account.service';

@Injectable()
export class AccountsEffects {
  private readonly actions$ = inject(Actions);
  private readonly bankAccountService = inject(BankAccountService);

  loadAccounts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountActions.loadAccounts),
      switchMap(() =>
        this.bankAccountService.getBankAccounts().pipe(
          map((accounts) => AccountActions.loadAccountsSuccess({ accounts })),
          catchError((error) =>
            of(
              AccountActions.loadAccountsError({
                error: { name: error?.name, message: error?.message },
              })
            )
          )
        )
      )
    )
  );
}
