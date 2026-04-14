import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CoreComponent } from './core/core.component';
import { ClientsComponent } from './clients/clients.component';
import { HomeComponent } from './core/home/home.component';
import { BookingsComponent } from './bookings/bookings.component';
import { RevenueComponent } from './core/revenue/revenue.component';
import { SettingsComponent } from './core/settings/settings.component';

import { authGuard } from './guards/auth.guard';
import { AnalyticsComponent } from './core/analytics/analytics.component';
import { VehicleComponent } from './core/vehicle/vehicle.component';
import { CalendarComponent } from './core/calendar/calendar.component';
import { RegisterComponent } from './register/register.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: '',
    canActivate: [authGuard],
    component: CoreComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'clients', component: ClientsComponent },
      { path: 'vehicles', component: VehicleComponent },
      { path: 'bookings', component: BookingsComponent },
      { path: 'revenue', component: RevenueComponent },
      { path: 'analytics', component: AnalyticsComponent },
      { path: 'calendar', component: CalendarComponent },
      { path: 'settings', component: SettingsComponent },
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
