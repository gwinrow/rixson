import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './../auth.guard';

import { DashboardComponent } from './dashboard/dashboard.component';
import { CaravansComponent } from './caravans/caravans.component';
import { NewCaravanComponent } from './new-caravan/new-caravan.component';
import { EditCaravanComponent } from './edit-caravan/edit-caravan.component';
import { BookingsComponent } from './bookings/bookings.component';
import { NewBookingComponent } from './new-booking/new-booking.component';
import { EditBookingComponent } from './edit-booking/edit-booking.component';
import { CustomersComponent } from './customers/customers.component';
import { NewCustomerComponent } from './new-customer/new-customer.component';
import { EditCustomerComponent } from './edit-customer/edit-customer.component';

const routes: Routes = [
  { path: '', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'caravans', component: CaravansComponent, canActivate: [AuthGuard] },
  { path: 'new-caravan', component: NewCaravanComponent, canActivate: [AuthGuard] },
  { path: 'edit-caravan/:id', component: EditCaravanComponent, canActivate: [AuthGuard] },
  { path: 'bookings/:caravanId', component: BookingsComponent, canActivate: [AuthGuard] },
  { path: 'new-booking/:caravanId', component: NewBookingComponent, canActivate: [AuthGuard] },
  { path: 'edit-booking/:id', component: EditBookingComponent, canActivate: [AuthGuard] },
  { path: 'customers', component: CustomersComponent, canActivate: [AuthGuard] },
  { path: 'new-customer', component: NewCustomerComponent, canActivate: [AuthGuard] },
  { path: 'edit-customer/:id', component: EditCustomerComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
