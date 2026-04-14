import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { ClientDetailsComponent } from './client-details/client-details.component';
import { TopbarComponent } from '../core/topbar/topbar.component';
import { Client } from '../models/client.model';
import { ClientService } from '../services/client.service';

@Component({
  selector: 'rentcar-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    TitleCasePipe,
    MatIcon,
    ClientDetailsComponent,
    TopbarComponent,
  ],
})
export class ClientsComponent implements OnInit {
  public clientService = inject(ClientService);
  public router = inject(Router);
  public Math = Math;
  public clients = signal<Client[]>([]);
  public currentPage = signal<number>(1);
  public pageSize = 10;
  
  public pages = computed(() => {
    const total = this.filteredClients().length;
    const count = Math.ceil(total / this.pageSize) || 1;
    return Array.from({ length: count }, (_, i) => i + 1);
  });
  public miniBarHeights = [30, 20, 36, 24, 40, 28, 48];
  public activeFilter = signal<'all' | 'vip' | 'active' | 'inactive'>('all');
  public searchQuery = signal<string>('');
  public selectedClient: Client | null = null;
  public viewMode: 'view' | 'edit' | 'add' = 'view';
  public isDeleting = false;
  public isLoading = signal<boolean>(false);

  public snackBar = inject(MatSnackBar);
  public route = inject(ActivatedRoute);

  public async ngOnInit(): Promise<void> {
    await this.loadClients();
    this.route.queryParams.subscribe((params: any) => {
      if (params['action'] === 'new') {
        this.openAddClient();
      }
    });
  }
  private async loadClients(): Promise<void> {
    this.isLoading.set(true);
    try {
      const data = await this.clientService.getClients();
      this.clients.set(data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      this.isLoading.set(false);
    }
  }
  public openDetails(client: Client, mode: 'view' | 'edit' = 'view', isDeletion = false): void {
    this.selectedClient = { ...client };
    this.viewMode = mode;
    this.isDeleting = isDeletion;
  }

  public openAddClient(): void {
    this.selectedClient = new Client();
    this.viewMode = 'add';
  }

  public closeDetails(): void {
    this.selectedClient = null;
    this.isDeleting = false;
  }

  public async onAddClient(client: Client): Promise<void> {
    try {
      await this.clientService.createClient(client);
      await this.loadClients();
      this.closeDetails();
      this.snackBar.open('Client added successfully!', 'Close', { duration: 3000 });
    } catch (error) {
      console.error('Add failed:', error);
    }
  }

  public async onUpdateClient(client: Client): Promise<void> {
    if (!this.selectedClient) return;
    try {
      await this.clientService.updateClient(this.selectedClient.id, client);
      await this.loadClients();
      this.closeDetails();
      this.snackBar.open('Client updated successfully!', 'Close', { duration: 3000 });
    } catch (error) {
      console.error('Update failed:', error);
    }
  }

  public async onDeleteClient(client: Client): Promise<void> {
    try {
      await this.clientService.deleteClient(client.id);
      await this.loadClients();
      this.closeDetails();
      this.snackBar.open('Client deleted successfully!', 'Close', { duration: 3000 });
    } catch (error) {
      console.error('Delete failed:', error);
    }
  }

  public onNewRental(client: Client): void {
    this.closeDetails();
    this.selectedClient = null;
  }

  public onMessage(client: Client): void {
    // hook up your messaging flow here
  }

  public get topClients(): Client[] {
    return [...this.clients()].sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5);
  }

  public formatCurrency(amount: number): string {
    return '$' + amount.toLocaleString();
  }

  public segments = computed(() => {
    const clients = this.clients();
    const total = clients.length || 1;

    const vipCount = clients.filter((c) => c.status === 'vip').length;
    const activeCount = clients.filter((c) => c.status === 'active').length;
    const inactiveCount = clients.filter((c) => c.status === 'inactive').length;

    // Calculate percentages
    const vipPct = Math.round((vipCount / total) * 100);
    const activePct = Math.round((activeCount / total) * 100);
    const inactivePct = Math.round((inactiveCount / total) * 100);

    return [
      { label: 'VIP Members', value: `${vipCount} clients · ${vipPct}%`, pct: vipPct, colorClass: 'seg-gold' },
      { label: 'Active', value: `${activeCount} clients · ${activePct}%`, pct: activePct, colorClass: 'seg-green' },
      { label: 'Inactive', value: `${inactiveCount} clients · ${inactivePct}%`, pct: inactivePct, colorClass: 'seg-blue' },
    ];
  });

  // Computed State
  public filteredClients = computed(() => {
    return this.clients().filter((c) => {
      const matchFilter = this.activeFilter() === 'all' || c.status === this.activeFilter();
      const matchSearch =
        c.name?.toLowerCase().includes(this.searchQuery().toLowerCase()) ||
        c.email?.toLowerCase().includes(this.searchQuery().toLowerCase());
      return matchFilter && matchSearch;
    });
  });

  public pagedClients = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredClients().slice(start, start + this.pageSize);
  });
  public stats = computed(() => [
    { label: 'Total Clients', value: this.clients().length.toString(), change: 'Live', up: true },
    {
      label: 'VIP Members',
      value: this.clients()
        .filter((c) => c.status === 'vip')
        .length.toString(),
      change: 'Live',
      up: true,
    },
    {
      label: 'Active',
      value: this.clients()
        .filter((c) => c.status === 'active')
        .length.toString(),
      change: 'Live',
      up: true,
    },
    {
      label: 'Inactive',
      value: this.clients()
        .filter((c) => c.status === 'inactive')
        .length.toString(),
      change: 'Live',
      up: false,
    },
  ]);
}
