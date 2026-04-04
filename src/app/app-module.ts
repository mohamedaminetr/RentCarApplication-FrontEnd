import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app.component';
import { AuthModule } from '@auth0/auth0-angular';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
@NgModule({
  declarations: [App],
  imports: [
    BrowserModule,
    CommonModule,
    MatIconModule,
    AppRoutingModule,
    AuthModule.forRoot({
      domain: 'dev-ikevpb56bdkpwyyu.us.auth0.com',
      clientId: '0vuGW1a1hoq4P6q4HmTZUYXrttmXTh63',
      authorizationParams: {
        redirect_uri: window.location.origin,
      },
    }),
  ],
  providers: [provideBrowserGlobalErrorListeners()],
  bootstrap: [App],
})
export class AppModule {}
