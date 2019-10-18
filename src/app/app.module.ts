import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Backend } from './helpers/backend';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AccountsComponent } from './components/accounts/accounts.component';
import { ErrorInterceptor } from './helpers/error.interceptor';
import { BasicAuthInterceptor } from './helpers/basic-auth.intercept';
import { AddAccountComponent } from './components/add-account/add-account.component';
import { AccountFormComponent } from './components/account-form/account-form.component';
import { EditAccountComponent } from './components/edit-account/edit-account.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    HomeComponent,
    AccountsComponent,
    AddAccountComponent,
    AccountFormComponent,
    EditAccountComponent
  ],
  imports: [BrowserModule, AppRoutingModule, ReactiveFormsModule, HttpClientModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BasicAuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: Backend,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
