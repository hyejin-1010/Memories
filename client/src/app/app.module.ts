import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { MatDialogModule } from '@angular/material/dialog';

import { AppComponent } from './app.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MainComponent } from './main/main.component';
import { AuthInterceptor } from './services/auth-interceptor';
import { SidenavComponent } from './sidenav/sidenav.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonPopupComponent } from './common-popup/common-popup.component';

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    SignUpComponent,
    NavbarComponent,
    MainComponent,
    SidenavComponent,
    CommonPopupComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatDialogModule,
  ],
  entryComponents: [
    CommonPopupComponent,
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
