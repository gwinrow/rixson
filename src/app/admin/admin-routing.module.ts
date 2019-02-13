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

const routes: Routes = [
  { path: '', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'caravans', component: CaravansComponent, canActivate: [AuthGuard] },
  { path: 'new-caravan', component: NewCaravanComponent, canActivate: [AuthGuard] },
  { path: 'edit-caravan/:id', component: EditCaravanComponent, canActivate: [AuthGuard] },
  { path: 'bookings/:caravanId', component: BookingsComponent, canActivate: [AuthGuard] },
  { path: 'new-booking/:caravanId', component: NewBookingComponent, canActivate: [AuthGuard] },
  { path: 'edit-booking/:id', component: EditBookingComponent, canActivate: [AuthGuard] }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
