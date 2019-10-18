import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse
} from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { User } from '../models/user';
import { Account } from '../models/account';
import { mergeMap, materialize, delay, dematerialize } from 'rxjs/operators';
import { Md5 } from 'ts-md5';

const users: User[] = [{ id: '1', username: 'admin', password: 'password' }];
let accounts: Account[] = [
  {
    id: 1,
    number: '96105019661079525306997133',
    currency: 'PLN',
    name: 'Awesome account',
    bankName: 'Awesome bank'
  },
  {
    id: 2,
    number: '96105019661079525306997134',
    currency: 'USD',
    name: 'Awesome account 2',
    bankName: 'Awesome bank 2'
  },
  {
    id: 3,
    number: '96105019661079525306997135',
    currency: 'EUR',
    name: 'Awesome account 3',
    bankName: 'Awesome bank 3'
  },
  {
    id: 4,
    number: '96105019661079525306997136',
    currency: 'EUR',
    name: 'Awesome account 4',
    bankName: 'Awesome bank 4'
  }
];

@Injectable()
export class Backend implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { url, method, headers, body } = request;
    return of(null)
      .pipe(mergeMap(handleRoute))
      .pipe(materialize())
      .pipe(delay(200))
      .pipe(dematerialize());

    function handleRoute() {
      switch (true) {
        case url.endsWith('/authenticate') && method === 'POST':
          return authenticate();
        case url.endsWith('/accounts') && method === 'GET':
          return getAccounts();
        case url.match(/\/accounts\/\d+$/) && method === 'GET':
          return getAccount();
        case url.endsWith('/accounts/add') && method === 'POST':
          return addAccount();
        case url.match(/\/accounts\/\d+$/) && method === 'PUT':
          return editAccount();
        case url.match(/\/accounts\/\d+$/) && method === 'DELETE':
          return deleteAccount();
        default:
          return next.handle(request);
      }
    }

    function authenticate() {
      const { username, password } = body;
      const user = users.find(user => user.username === username && user.password === password);
      if (!user) return throwError('Invalid user credentials');
      return of(new HttpResponse({ status: 200, body: { id: user.id, username: user.username } }));
    }

    function loggedIn() {
      return headers.get('Authorization') == `Basic ${Md5.hashStr('root:12345678')}`;
    }

    function unauthorized() {
      return throwError({ status: 401, error: { message: 'Unauthorized' } });
    }

    function ok(body?) {
      return of(new HttpResponse({ status: 200, body }));
    }

    function error(message: string) {
      return throwError({ error: { message } });
    }

    function getAccounts() {
      return ok(accounts);
    }

    function getAccount() {
      if (!loggedIn()) return unauthorized();
      const account = accounts.find(account => account.id === idFromUrl());
      return ok(account);
    }

    function addAccount() {
      if (!loggedIn()) return unauthorized();
      const account = body;

      if (accounts.find(acc => acc.number === account.number)) {
        return error(`Account ${account.number} already exist`);
      }

      account.id = accounts.length ? Math.max(...accounts.map(acc => acc.id)) + 1 : 1;
      accounts.push(account);

      return ok(accounts);
    }

    function deleteAccount() {
      if (!loggedIn()) return unauthorized();
      accounts = accounts.filter(acc => acc.id != idFromUrl());
      return ok(accounts);
    }

    function editAccount() {
      if (!loggedIn()) return unauthorized();
      const account = body;

      accounts.forEach(acc => {
        if (acc.id == idFromUrl()) acc = account;
      });

      return ok(accounts);
    }

    function idFromUrl() {
      const urlParts = url.split('/');
      return parseInt(urlParts[urlParts.length - 1]);
    }
  }
  constructor() {}
}
