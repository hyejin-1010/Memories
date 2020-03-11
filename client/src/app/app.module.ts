import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';

import { AppComponent } from './app.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MainComponent } from './main/main.component';
import { AuthInterceptor } from './services/auth-interceptor';
import { SidenavComponent } from './sidenav/sidenav.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonPopupComponent } from './common-popup/common-popup.component';
import { ClubScheduleComponent } from './club/club-schedule/club-schedule.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { ScheduleDialogComponent } from './schedule-dialog/schedule-dialog.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { ClubGalleryComponent } from './club/club-gallery/club-gallery.component';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { ImageViewerDialogComponent } from './image-viewer-dialog/image-viewer-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    SignUpComponent,
    NavbarComponent,
    MainComponent,
    SidenavComponent,
    CommonPopupComponent,
    ClubScheduleComponent,
    ScheduleDialogComponent,
    ClubGalleryComponent,
    ImageUploadComponent,
    ImageViewerDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatSelectModule,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
  ],
  entryComponents: [
    CommonPopupComponent,
    ScheduleDialogComponent,
    ImageUploadComponent,
    ImageViewerDialogComponent,
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
