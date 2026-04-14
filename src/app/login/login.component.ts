import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService, Credentials } from '../services/auth.service';
import { email, form, FormField, required } from '@angular/forms/signals';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'rentcar-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [CommonModule, MatIconModule, FormField, ReactiveFormsModule, RouterModule],
})
export class LoginComponent {
  public authService = inject(AuthService);
  public router = inject(Router);
  public isLoading = signal(false);
  public error = signal<string | null>(null);

  // Signal-based form
  public loginModel = signal<Credentials>({
    email: '',
    password: '',
  });

  public loginForm = form(this.loginModel, (fieldPath) => {
    required(fieldPath.email, { message: 'Email is required' });
    required(fieldPath.password, { message: 'Password is required' });
    email(fieldPath.email, { message: 'Enter a valid email address' });
  });

  public async onLogin(event: Event): Promise<void> {
    event.preventDefault();
    this.isLoading.set(true);
    this.error.set(null);

    try {
      await this.authService.login({
        email: this.loginForm.email().value(),
        password: this.loginForm.password().value(),
      });
      this.isLoading.set(false);
      this.router.navigate(['/home']);
    } catch (err) {
      this.isLoading.set(false);
      this.error.set('Login failed. Please check your credentials.');
      console.error('Login Error:', err);
    }
  }

  public navigateTo(routeTo: string): void {
    this.router.navigate([routeTo]);
  }

  public async onLogout(): Promise<void> {
    await this.authService.logout();
  }
}
