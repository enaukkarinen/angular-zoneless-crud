import { transactionsFeature } from './transactions.reducer';

export const {
  selectTransactionsState,
  selectTransactions,
  selectLoading: selectTransactionsLoading,
  selectError: selectTransactionsError,
} = transactionsFeature;
