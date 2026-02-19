import { createFeature, createReducer, on } from '@ngrx/store';
import * as AccountsActions from './accounts.actions';
import { BankAccount } from '@app/core/bank-account/bank-account.interface';

export interface AccountsState {
  accounts: BankAccount[];
  loading: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
}

export const initialAccountsState: AccountsState = {
  accounts: [],
  loading: false,
  error: null,
};

const reducer = createReducer(
  initialAccountsState,

  on(AccountsActions.loadAccounts, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(AccountsActions.loadAccountsSuccess, (state, { accounts }) => ({
    ...state,
    accounts,
    loading: false,
  })),

  on(AccountsActions.loadAccountsError, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);

export const accountsFeature = createFeature({
  name: 'accounts',
  reducer,
});
