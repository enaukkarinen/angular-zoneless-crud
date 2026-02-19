import { accountsFeature } from './accounts.reducer';

export const {
  selectAccountsState,
  selectAccounts,
  selectLoading: selectAccountsLoading,
  selectError: selectAccountsError,
} = accountsFeature;
