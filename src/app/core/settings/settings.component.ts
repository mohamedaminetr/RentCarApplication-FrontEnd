import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TopbarComponent } from '../topbar/topbar.component';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { NotificationService } from '../../services/notification.service';
import { form, required, email, minLength, FormField } from '@angular/forms/signals';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, MatIconModule, TopbarComponent, FormsModule, ReactiveFormsModule, FormField],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent implements OnInit {
  public authService = inject(AuthService);
  public userService = inject(UserService);
  public notificationService = inject(NotificationService);
  public snackBar = inject(MatSnackBar);

  public isEditing = signal(false);
  public isLoading = signal(false);

  public profileModel = signal({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: ''
  });

  public profileForm = form(this.profileModel, (f) => {
    required(f.firstName, { message: 'First name is required' });
    required(f.lastName, { message: 'Last name is required' });
    required(f.email, { message: 'Email is required' });
    email(f.email, { message: 'Enter a valid email address' });
  });

  ngOnInit() {
    this.resetForm();
  }

  public resetForm() {
    const user = this.authService.currentUser();
    if (user) {
      this.profileModel.set({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        password: ''
      });
    }
  }

  public toggleEdit() {
    this.isEditing.update(v => !v);
    if (!this.isEditing()) {
      this.resetForm();
    }
  }

  public async saveProfile() {
    if (this.profileForm().invalid()) {
      this.snackBar.open('Please fix form errors', 'Close', { duration: 3000 });
      return;
    }

    const user = this.authService.currentUser();
    if (!user) return;

    this.isLoading.set(true);

    const updateData: any = {
      firstName: this.profileForm.firstName().value(),
      lastName: this.profileForm.lastName().value(),
      email: this.profileForm.email().value(),
      phone: this.profileForm.phone().value(),
    };

    const pwd = this.profileForm.password().value();
    if (pwd && pwd.trim().length >= 6) {
      updateData.password = pwd;
    }

    // Retain required existing fields (age, sexe, birthday) if they are strictly required by PUT
    updateData.age = user.age || 0;
    updateData.sexe = user.sexe || 'M';
    updateData.birthday = user.birthday || new Date().toISOString();

    try {
      const updatedUser = await this.userService.updateUser(user.id, updateData);
      
      // Update global auth state
      this.authService.currentUser.set(updatedUser);
      this.authService['persistence'].set('user', updatedUser); // sync localstorage

      this.isEditing.set(false);
      this.isLoading.set(false);
      
      this.snackBar.open('Profile updated successfully', 'Close', { duration: 3000 });
      this.notificationService.add('Profile Updated', 'Your account settings have been saved.', 'success');
      this.profileForm.password().value.set(''); // Clear password field
      
    } catch (err) {
      console.error(err);
      this.isLoading.set(false);
      this.snackBar.open('Failed to update profile', 'Close', { duration: 3000 });
    }
  }
}
