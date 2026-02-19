import { TestBed, waitForAsync } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot } from 'jest-marbles';

import { BankAccountService } from '@app/core/bank-account/bank-account.service';
import { BankAccount } from '@app/core/bank-account/bank-account.interface';
import { loadAccounts, loadAccountsError, loadAccountsSuccess } from './accounts.actions';
import { AccountsEffects } from './accounts.effects';

const mockBankAccounts: BankAccount[] = [
  {
    id: 1,
    bank_name: 'Bank A',
    account_holder_name: 'Miss Jane A Smith',
    sort_code: '111111',
    account_number: '11111111',
    client_id: 1,
    current_value: 128746.281,
  },
];

describe('AccountsEffects', () => {
  let effects: AccountsEffects;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let actions: Observable<any>;
  let bankAccountService: BankAccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        AccountsEffects,
        provideMockActions(() => actions),
        {
          provide: BankAccountService,
          useValue: {
            getBankAccounts: jest.fn(),
          },
        },
      ],
    });

    effects = TestBed.inject(AccountsEffects);
    bankAccountService = TestBed.inject(BankAccountService);
  });

  it('should load accounts successfully', waitForAsync(() => {
    jest.spyOn(bankAccountService, 'getBankAccounts').mockReturnValue(of(mockBankAccounts));

    actions = hot('--a', {
      a: loadAccounts(),
    });

    const expected = cold('--b', {
      b: loadAccountsSuccess({ accounts: mockBankAccounts }),
    });

    expect(effects.loadAccounts$).toBeObservable(expected);
  }));

  it('should handle load accounts failure', waitForAsync(() => {
    const error = new Error('Failed to load accounts');
    jest.spyOn(bankAccountService, 'getBankAccounts').mockReturnValue(throwError(() => error));

    actions = hot('--a', {
      a: loadAccounts(),
    });

    const expected = cold('--b', {
      b: loadAccountsError({ error: { name: 'Error', message: 'Failed to load accounts' } }),
    });

    expect(effects.loadAccounts$).toBeObservable(expected);
  }));
});
