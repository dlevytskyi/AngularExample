import { Component, OnInit, Input } from '@angular/core';
import { AccountService } from 'src/app/services/account.service';
import { Account } from 'src/app/models/account';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-account-form',
  templateUrl: './account-form.component.html',
  styleUrls: ['./account-form.component.scss']
})
export class AccountFormComponent implements OnInit {
  @Input('formContext') formContext: string;
  private account: Account;
  public accountForm: FormGroup;
  public submitted: Boolean;
  public success: string;
  public errorMsg: string;
  private returnUrl: string;
  private accountId: number;
  private createForm: Function;

  constructor(
    private accountService: AccountService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.createForm = (account = new Account()) => {
      return this.fb.group({
        name: [account.name || '', Validators.required],
        number: [
          account.number || '',
          [
            Validators.required,
            Validators.pattern(/\d/gi),
            Validators.minLength(26),
            Validators.maxLength(26)
          ]
        ],
        currency: [account.currency || '', [Validators.required]],
        bankName: [account.bankName || '', [Validators.required]]
      });
    };
  }

  get form() {
    return this.accountForm.controls;
  }

  ngOnInit() {
    this.account = new Account();
    this.accountForm = this.createForm();

    if (this.formContext === 'EDIT') {
      this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'];
      this.accountId = this.activatedRoute.snapshot.queryParams['accountId'];
      this.accountService
        .getAccount(this.accountId)
        .pipe(first())
        .subscribe(account => {
          this.account = account;
          this.accountForm = this.createForm(this.account);
        });
    }
  }

  clearErrorMsg() {
    this.errorMsg = null;
  }

  back() {
    this.router.navigate([this.returnUrl]);
  }

  submit() {
    this.submitted = true;
    this.success = null;
    if (this.accountForm.invalid) {
      return;
    }

    this.account.name = this.form.name.value;
    this.account.number = this.form.number.value;
    this.account.currency = this.form.currency.value;
    this.account.bankName = this.form.bankName.value;

    if (this.formContext === 'ADD') {
      this.accountService
        .addAccount(this.account)
        .pipe(first())
        .subscribe(
          data => {
            this.success = 'Account added successfully';
            this.account = new Account();
          },
          error => {
            this.errorMsg = error;
          }
        );
    }

    if (this.formContext === 'EDIT') {
      this.accountService
        .editAccount(this.account)
        .pipe(first())
        .subscribe(
          data => {
            this.success = 'Account eddited successfully';
          },
          error => {
            this.errorMsg = error;
          }
        );
    }
  }
}
