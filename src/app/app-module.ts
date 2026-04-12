import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app.component';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { authInterceptor } from './interceptors/auth.interceptor';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

@NgModule({
  declarations: [App],
  imports: [
    BrowserModule,
    CommonModule,
    MatIconModule,
    MatSnackBarModule,
    AppRoutingModule,
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimationsAsync(),
  ],
  bootstrap: [App],
})
export class AppModule {}
