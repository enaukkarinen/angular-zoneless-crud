import { CommonModule } from '@angular/common';
import { Component, DestroyRef, Input, AfterViewInit, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { combineLatest, Observable, startWith } from 'rxjs';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { AmountWithinBalanceValidatorDirective } from '../amount-within-balance.validator';

@Component({
  selector: 'app-amount-input-field',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    AmountWithinBalanceValidatorDirective,
  ],
  template: `
    <mat-form-field appearance="outline" class="full" *ngIf="showAmount">
      <mat-label>Amount</mat-label>
      <input
        matInput
        type="number"
        [formControl]="amountControl"
        amountWithinBalance
        [balance$]="balance$"
        [enabled]="enableBalanceCheck" />

      <mat-error *ngIf="amountControl.hasError('insufficientFunds')">
        Insufficient funds.
      </mat-error>
      <mat-error *ngIf="amountControl.hasError('required')"> Amount is required. </mat-error>
      <mat-error *ngIf="amountControl.hasError('min')"> Amount must be greater than 0. </mat-error>
    </mat-form-field>
    <mat-checkbox [formControl]="withdrawFullValueControl" *ngIf="showWithdrawFullValueToggle">
      Would you like to withdraw the full value of this account?
    </mat-checkbox>
  `,
  styles: [
    `
      .full {
        width: 100%;
      }
    `,
  ],
})
export class AmountInputFieldComponent implements AfterViewInit {
  // This is a different flavour of a custom form control
  // where form controls are defined in the parent component
  // and this component just takes in the relevant controls as inputs.

  private readonly destroyRef = inject(DestroyRef);
  private _showWithdrawFullValueToggle = true;

  @Input() amountControl!: FormControl<number | null>;
  @Input() withdrawFullValueControl!: FormControl<boolean>;
  @Input() balance$!: Observable<number | null>;
  @Input() enableBalanceCheck = false;

  @Input()
  set showWithdrawFullValueToggle(value: boolean) {
    this._showWithdrawFullValueToggle = value;

    // If the toggle is being hidden, force reset to false
    if (!value) {
      this.withdrawFullValueControl?.setValue(false, { emitEvent: false });
      this.enableAmountField();
    }
  }
  get showWithdrawFullValueToggle() {
    return this._showWithdrawFullValueToggle;
  }

  showAmount = true;

  ngAfterViewInit() {
    combineLatest([
      this.withdrawFullValueControl.valueChanges.pipe(
        // .valueChanges does not emit on initialization
        startWith(this.withdrawFullValueControl.value)
      ),
      this.balance$.pipe(startWith(null)),
    ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([full, balance]) => {
        if (full) {
          this.showAmount = false;

          if (balance != null) {
            this.amountControl.setValue(balance, { emitEvent: false });
          }

          this.amountControl.disable({ emitEvent: false });
          this.amountControl.clearValidators();
          this.amountControl.updateValueAndValidity({ emitEvent: false });
        } else {
          this.enableAmountField();
        }
      });

    // clear amount field if user toggles off "withdraw full value"
    this.withdrawFullValueControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        if (!value) this.amountControl.reset(null, { emitEvent: false });
      });
  }

  private enableAmountField() {
    this.showAmount = true;
    this.amountControl.enable({ emitEvent: false });
    this.amountControl.setValidators([Validators.required, Validators.min(0.01)]);
    this.amountControl.updateValueAndValidity({ emitEvent: false });
  }
}
