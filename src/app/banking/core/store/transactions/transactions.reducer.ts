import { createFeature, createReducer, on } from '@ngrx/store';
import * as TransactionsActions from './transactions.actions';
import { Transaction } from '@app/core/transaction/transaction.interface';

export interface TransactionsState {
  transactions: Transaction[]; // This could be done with EntityAdapter but keeping it simple
  loading: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
}

export const initialTransactionsState: TransactionsState = {
  transactions: [],
  loading: false,
  error: null,
};

const reducer = createReducer(
  initialTransactionsState,

  on(TransactionsActions.loadTransactions, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(TransactionsActions.loadTransactionsSuccess, (state, { transactions }) => ({
    ...state,
    transactions,
    loading: false,
  })),

  on(TransactionsActions.loadTransactionsError, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(TransactionsActions.createTransaction, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(TransactionsActions.createTransactionSuccess, (state, { transaction }) => ({
    ...state,
    transactions: [...state.transactions, transaction],
    loading: false,
  })),

  on(TransactionsActions.createTransactionError, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);

export const transactionsFeature = createFeature({
  name: 'transactions',
  reducer,
});
