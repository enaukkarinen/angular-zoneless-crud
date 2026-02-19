import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { initialTransactionsState } from '@app/banking/core/store/transactions/transactions.reducer';
import { initialAccountsState } from '@app/banking/core/store/accounts/accounts.reducer';
import {
  Transaction,
  TransactionCreate,
  TransactionType,
} from '@app/core/transaction/transaction.interface';

import { BankingComponent } from './banking.component';
import { BankAccount } from '@app/core/bank-account/bank-account.interface';
import { MatDialog } from '@angular/material/dialog';
import { createTransaction } from './core/store/transactions/transactions.actions';

const initialState = {
  accounts: initialAccountsState,
  transactions: initialTransactionsState,
};

const mockAccounts: BankAccount[] = [
  {
    id: 1,
    bank_name: 'Bank A',
    account_holder_name: 'Miss Jane A Smith',
    sort_code: '111111',
    account_number: '11111111',
    client_id: 1,
    current_value: 128746.281,
  },
  {
    id: 2,
    bank_name: 'Bank B',
    account_holder_name: 'Thomas Christopher Wright',
    sort_code: '222222',
    account_number: '22222222',
    client_id: 2,
    current_value: 46.2,
  },
];

const mockTransactions: Transaction[] = [
  {
    id: 1,
    transaction_type: TransactionType.DEPOSIT,
    amount: 100,
    source_bank_account_id: null,
    target_bank_account_id: 2,
    description: "Thomas' birthday present",
  },
  {
    id: 2,
    transaction_type: TransactionType.TRANSFER,
    amount: 12502,
    source_bank_account_id: 1,
    target_bank_account_id: 5,
    description: 'Janes transfer',
  },
];

const mockTransactionCreate: TransactionCreate = {
  transaction_type: TransactionType.DEPOSIT,
  amount: 100,
  source_bank_account_id: null,
  target_bank_account_id: 2,
  description: "Thomas' birthday present",
};

describe(BankingComponent.name, () => {
  let component: BankingComponent;
  let fixture: ComponentFixture<BankingComponent>;
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BankingComponent],
      providers: [
        provideMockStore({ initialState }),
        {
          provide: MatDialog,
          useValue: {
            open: jest.fn().mockReturnValue({
              afterClosed: () => ({
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                subscribe: (callback: any) => callback(mockTransactionCreate),
              }),
            }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BankingComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render', () => {
    store.setState({
      accounts: {
        ...initialAccountsState,
        accounts: mockAccounts,
      },
      transactions: {
        ...initialTransactionsState,
        transactions: mockTransactions,
      },
    });
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('should dispatch loadTransactions and loadAccounts on init', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    fixture.detectChanges();

    component.ngOnInit();

    expect(dispatchSpy).toHaveBeenCalledWith({ type: '[Transactions] Load' });
    expect(dispatchSpy).toHaveBeenCalledWith({ type: '[Accounts] Load' });
  });

  it('should dispatch createTransaction on create', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    component.create();

    expect(dispatchSpy).toHaveBeenCalledWith(createTransaction(mockTransactionCreate));
  });
});
