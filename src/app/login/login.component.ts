import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'rentcar-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [CommonModule],
})
export class LoginComponent {
  constructor(
    public router: Router,
    public auth: AuthService,
  ) {}

  public login(isSignUp = false): void {
    this.auth.loginWithRedirect({
      authorizationParams: {
        screen_hint: isSignUp ? 'signup' : 'login',
      },
    });
  }

  public loginWithGoogle(): void {
    this.auth.loginWithRedirect({
      authorizationParams: {
        connection: 'google-oauth2',
      },
    });
  }

  public logout(): void {
    this.auth.logout({
      logoutParams: { returnTo: window.location.origin },
    });
  }
  public navigateTo(routeTo: string): void {
    this.router.navigate([routeTo]);
  }
}
