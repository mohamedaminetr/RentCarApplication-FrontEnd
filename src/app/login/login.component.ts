import { Component, Inject } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'rentcar-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, JsonPipe],
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

  public logout(): void {
    this.auth.logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  }

  public navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
