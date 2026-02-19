import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, of } from 'rxjs';

import { TransactionService } from '@app/core/transaction/transaction.service';
import * as TransactionsActions from './transactions.actions';

@Injectable()
export class TransactionsEffects {
  private readonly actions$ = inject(Actions);
  private readonly transactionService = inject(TransactionService);

  loadTransactions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TransactionsActions.loadTransactions),
      switchMap(() =>
        this.transactionService.getTransactions().pipe(
          map((transactions) => TransactionsActions.loadTransactionsSuccess({ transactions })),
          catchError((error) =>
            of(
              TransactionsActions.loadTransactionsError({
                error: { name: error?.name, message: error?.message },
              })
            )
          )
        )
      )
    )
  );

  createTransaction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TransactionsActions.createTransaction),
      switchMap(({ ...transactionCreate }) =>
        this.transactionService.createTransaction(transactionCreate).pipe(
          map((transaction) => TransactionsActions.createTransactionSuccess({ transaction })),
          catchError((error) =>
            of(
              TransactionsActions.createTransactionError({
                error: { name: error?.name, message: error?.message },
              })
            )
          )
        )
      )
    )
  );
}
