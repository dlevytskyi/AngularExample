import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Account } from '../models/account';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  constructor(private http: HttpClient) {}

  getAllAccounts() {
    return this.http.get<Account[]>('/accounts');
  }

  getAccount(id: number) {
    return this.http.get<Account>(`/accounts/${id}`);
  }

  deleteAccount(id: number) {
    return this.http.delete<Account[]>(`/accounts/${id}`);
  }

  editAccount(account: Account) {
    return this.http.put<any>(`/accounts/${account.id}`, account);
  }

  addAccount(account: Account) {
    return this.http.post<any>('/accounts/add', account);
  }
}
