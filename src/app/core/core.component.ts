import { CommonModule, AsyncPipe } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'rentcar-homepage',
  templateUrl: './core.component.html',
  styleUrl: './core.component.scss',
  imports: [RouterOutlet, CommonModule, FormsModule, AsyncPipe],
})
export class CoreComponent implements OnInit, AfterViewInit {
  public navItems = [
    { id: 'home', label: 'Dashboard', route: '/home', badge: null, section: 'main' },
    { id: 'fleet', label: 'Fleet', route: '/fleet', badge: '24', section: 'main' },
    { id: 'bookings', label: 'Bookings', route: '/bookings', badge: '7', section: 'main' },
    { id: 'clients', label: 'Clients', route: '/clients', badge: '142', section: 'main' },
    { id: 'revenue', label: 'Revenue', route: '/revenue', badge: null, section: 'finance' },
    { id: 'analytics', label: 'Analytics', route: '/analytics', badge: null, section: 'finance' },
    { id: 'settings', label: 'Settings', route: '/settings', badge: null, section: 'settings' },
  ];

  activeNav: string = '';

  constructor(
    @Inject(AuthService) public auth: AuthService,
    public router: Router,
  ) {}

  ngOnInit(): void {
    this.syncActiveNav(this.router.url);

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.syncActiveNav(event.url);
      });
  }

  ngAfterViewInit(): void {}

  private syncActiveNav(url: string): void {
    const currentRoute = url.split('/')[1] || 'home';
    const match = this.navItems.find((n) => n.route === `/${currentRoute}`);
    this.activeNav = match?.id || 'home';
  }

  public selectedNavChanges(navId: string): void {
    this.activeNav = navId;
    const nav = this.navItems.find((n) => n.id === navId);
    if (nav) {
      this.router.navigate([nav.route]);
    }
  }

  public getNavBySection(section: string) {
    return this.navItems.filter((item) => item.section === section);
  }
}
