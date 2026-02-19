import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';

import { transactionsFeature } from '@app/banking/core/store/transactions/transactions.reducer';
import { TransactionsEffects } from '@app/banking/core/store/transactions/transactions.effects';
import { accountsFeature } from '@app/banking/core/store/accounts/accounts.reducer';
import { AccountsEffects } from '@app/banking/core/store/accounts/accounts.effects';

export function provideBankingFeature(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideState(transactionsFeature),
    provideEffects(TransactionsEffects),
    provideState(accountsFeature),
    provideEffects(AccountsEffects),
  ]);
}
