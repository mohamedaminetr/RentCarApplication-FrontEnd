import { Component, Inject } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';

export interface Client {
  initials: string;
  name: string;
  email: string;
  phone: string;
  rentals: number;
  totalSpent: number;
  status: 'vip' | 'active' | 'inactive';
  avatarClass: string;
}

@Component({
  selector: 'rentcar-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss'],
  imports: [CommonModule, FormsModule, TitleCasePipe, MatIcon],
})
export class ClientsComponent {
  searchQuery = '';
  activeFilter: 'all' | 'vip' | 'active' | 'inactive' = 'all';
  currentPage = 1;
  pages = [1, 2, 3];
  miniBarHeights = [30, 20, 36, 24, 40, 28, 48];

  stats = [
    { label: 'Total Clients', value: '142', change: '↑ 12 this month', up: true },
    { label: 'VIP Members', value: '28', change: '↑ 3 new', up: true },
    { label: 'Avg. Lifetime Value', value: '$2.4k', change: '↑ 8% vs last qtr', up: true },
    { label: 'Inactive (90d)', value: '19', change: '↑ 4 this month', up: false },
  ];

  allClients: Client[] = [
    {
      initials: 'KA',
      name: 'Karim Ayari',
      email: 'k.ayari@email.com',
      phone: '+216 55 123 456',
      rentals: 14,
      totalSpent: 3240,
      status: 'vip',
      avatarClass: 'av-gold',
    },
    {
      initials: 'SB',
      name: 'Sonia Ben Ali',
      email: 'sonia.ba@email.com',
      phone: '+216 98 765 432',
      rentals: 9,
      totalSpent: 2180,
      status: 'active',
      avatarClass: 'av-teal',
    },
    {
      initials: 'MH',
      name: 'Mohamed Hamdi',
      email: 'm.hamdi@email.com',
      phone: '+216 22 334 556',
      rentals: 6,
      totalSpent: 1560,
      status: 'active',
      avatarClass: 'av-blue',
    },
    {
      initials: 'LT',
      name: 'Leila Trabelsi',
      email: 'l.trabelsi@email.com',
      phone: '+216 71 889 900',
      rentals: 21,
      totalSpent: 5840,
      status: 'vip',
      avatarClass: 'av-purple',
    },
    {
      initials: 'RB',
      name: 'Rami Bchir',
      email: 'r.bchir@email.com',
      phone: '+216 50 112 233',
      rentals: 2,
      totalSpent: 380,
      status: 'inactive',
      avatarClass: 'av-red',
    },
    {
      initials: 'NA',
      name: 'Nour Aouadi',
      email: 'n.aouadi@email.com',
      phone: '+216 93 441 220',
      rentals: 11,
      totalSpent: 2990,
      status: 'vip',
      avatarClass: 'av-gold',
    },
  ];

  segments = [
    { label: 'VIP Members', value: '28 clients · 20%', pct: 20, colorClass: 'seg-gold' },
    { label: 'Regular Active', value: '87 clients · 61%', pct: 61, colorClass: 'seg-green' },
    { label: 'Occasional', value: '27 clients · 19%', pct: 19, colorClass: 'seg-blue' },
    { label: 'Inactive (90d+)', value: '19 clients · 13%', pct: 13, colorClass: 'seg-red' },
  ];

  constructor(
    public router: Router,
    @Inject(AuthService) public auth: AuthService,
  ) {}

  get topClients(): Client[] {
    return [...this.allClients].sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5);
  }

  get filteredClients(): Client[] {
    return this.allClients.filter((c) => {
      const matchesFilter = this.activeFilter === 'all' || c.status === this.activeFilter;
      const matchesSearch =
        c.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }

  setFilter(filter: 'all' | 'vip' | 'active' | 'inactive'): void {
    this.activeFilter = filter;
  }

  formatCurrency(amount: number): string {
    return '$' + amount.toLocaleString();
  }

  logout(): void {
    this.auth.logout({ logoutParams: { returnTo: window.location.origin } });
  }
}
