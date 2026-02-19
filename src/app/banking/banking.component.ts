import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';

import { Store } from '@ngrx/store';

import { MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { loadAccounts } from '@app/banking/core/store/accounts/accounts.actions';
import { selectExtendedTransactions } from '@app/banking/core/store/banking.selectors';
import { CreateTransactionFormComponent } from '@app/banking/shared/create-transaction-form/create-transaction-form.component';
import {
  createTransaction,
  loadTransactions,
} from '@app/banking/core/store/transactions/transactions.actions';
import { TableComponent } from '@app/banking/shared/table/table.component';

@Component({
  selector: 'app-banking',
  templateUrl: './banking.component.html',
  styleUrls: ['./banking.component.scss'],
  imports: [TableComponent, MatButtonModule, AsyncPipe, MatCardModule],
})
export class BankingComponent implements OnInit {
  store = inject(Store);
  dialog = inject(MatDialog);

  extentedTransactions$ = this.store.select(selectExtendedTransactions);

  ngOnInit() {
    this.store.dispatch(loadTransactions());
    this.store.dispatch(loadAccounts());
  }

  create() {
    this.dialog
      .open(CreateTransactionFormComponent, {
        width: '400px',
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.store.dispatch(createTransaction(result));
        }
      });
  }
}
