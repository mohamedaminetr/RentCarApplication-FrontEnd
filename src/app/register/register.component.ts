import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../services/auth.service';
import { email, minLength, required, form, FormField } from '@angular/forms/signals';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormField, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  public isLoading = signal(false);
  public error = signal<string | null>(null);

  public registerModel = signal({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  public registerForm = form(this.registerModel, (f) => {
    required(f.firstName, { message: 'First name is required' });
    required(f.lastName, { message: 'Last name is required' });
    required(f.email, { message: 'Email is required' });
    email(f.email, { message: 'Enter a valid email' });
    required(f.password, { message: 'Password is required' });
    minLength(f.password, 6, { message: 'Password must be at least 6 characters' });
  });

  public async onRegister(event: Event): Promise<void> {
    event.preventDefault();
    this.isLoading.set(true);
    this.error.set(null);

    try {
      await this.authService.register({
        firstName: this.registerForm.firstName().value(),
        lastName: this.registerForm.lastName().value(),
        email: this.registerForm.email().value(),
        password: this.registerForm.password().value(),
      });
      this.isLoading.set(false);
      this.router.navigate(['/login'], { queryParams: { registered: true } });
    } catch (err: any) {
      this.isLoading.set(false);
      const backendError = err.error?.message || err.error?.error || err.message;
      this.error.set(backendError || 'Registration failed. Try again later.');
    }
  }
}
