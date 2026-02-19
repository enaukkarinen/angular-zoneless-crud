import { createAction, props } from '@ngrx/store';
import { Transaction, TransactionCreate } from '@app/core/transaction/transaction.interface';

export const loadTransactions = createAction('[Transactions] Load');

export const loadTransactionsSuccess = createAction(
  '[Transactions] Load Success',
  props<{ transactions: Transaction[] }>()
);

export const loadTransactionsError = createAction(
  '[Transactions] Load Error',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props<{ error: any }>()
);

export const createTransaction = createAction('[Transactions] Create', props<TransactionCreate>());

export const createTransactionSuccess = createAction(
  '[Transactions] Create Success',
  props<{ transaction: Transaction }>()
);

export const createTransactionError = createAction(
  '[Transactions] Create Error',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props<{ error: any }>()
);
