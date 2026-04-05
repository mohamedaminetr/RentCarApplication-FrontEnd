import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TopbarComponent } from '../core/topbar/topbar.component';

@Component({
  selector: 'app-revenue',
  standalone: true,
  imports: [CommonModule, MatIconModule, TopbarComponent],
  templateUrl: './revenue.component.html',
  styleUrl: './revenue.component.scss',
})
export class RevenueComponent {}
