import { Component, OnInit } from '@angular/core';
import { Account } from 'src/app/models/account';
import { AccountService } from 'src/app/services/account.service';
import { first } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {
  public accounts: Account[];
  public errorMsg: string;
  private accountSubscription: Subscription;

  constructor(
    private accountService: AccountService,
    public authenticationService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.accountSubscription = this.accountService
      .getAllAccounts()
      .pipe(first())
      .subscribe(accounts => (this.accounts = accounts));
  }

  ngOnDestroy() {
    this.accountSubscription.unsubscribe();
  }

  deleteAccount(id: number) {
    if (!this.authenticationService.currentUserValue) {
      this.errorMsg = 'You are not authorized';
      return;
    }

    this.accountSubscription = this.accountService
      .deleteAccount(id)
      .pipe(first())
      .subscribe(accounts => (this.accounts = accounts));
  }

  editAccount(id: number) {
    if (!this.authenticationService.currentUserValue) {
      this.errorMsg = 'You are not authorized';
      return;
    }

    this.router.navigate(['/edit-account'], {
      queryParams: { returnUrl: '/accounts', accountId: id }
    });
  }
}
