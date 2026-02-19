import { createSelector } from '@ngrx/store';
import { ExtendedTransaction } from '@app/core/transaction/transaction.interface';
import { selectTransactions } from '@app/banking/core/store/transactions/transactions.selectors';
import { selectAccounts } from '@app/banking/core/store/accounts/accounts.selectors';

import { BankAccount, NestedBankAccount } from '@app/core/bank-account/bank-account.interface';

function toNested(a: BankAccount): NestedBankAccount {
  return {
    bank_name: a.bank_name,
    account_holder_name: a.account_holder_name,
    sort_code: a.sort_code,
    account_number: a.account_number,
  };
}

export const selectExtendedTransactions = createSelector(
  selectTransactions,
  selectAccounts,
  (transactions, accounts): ExtendedTransaction[] => {
    const byId = new Map(accounts.map((a) => [a.id, a]));

    return transactions
      .map((t): ExtendedTransaction | null => {
        const source = t.source_bank_account_id ? byId.get(t.source_bank_account_id) : null;
        const target = t.target_bank_account_id ? byId.get(t.target_bank_account_id) : null;

        // if (!source || !target) return null;

        return {
          ...t,
          source: source ? toNested(source) : undefined,
          target: target ? toNested(target) : undefined,
        };
      })
      .filter((x) => !!x);
  }
);
