import { BankAccount } from '@app/core/bank-account/bank-account.interface';
import { createAction, props } from '@ngrx/store';

export const loadAccounts = createAction('[Accounts] Load');

export const loadAccountsSuccess = createAction(
  '[Accounts] Load Success',
  props<{ accounts: BankAccount[] }>()
);

export const loadAccountsError = createAction(
  '[Accounts] Load Error',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props<{ error: any }>()
);
