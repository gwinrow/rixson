import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { CaravansComponent } from './caravans/caravans.component';
import { NewCaravanComponent } from './new-caravan/new-caravan.component';
import { EditCaravanComponent } from './edit-caravan/edit-caravan.component';
import { BookingsComponent } from './bookings/bookings.component';
import { NewBookingComponent } from './new-booking/new-booking.component';
import { EditBookingComponent } from './edit-booking/edit-booking.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'caravans', component: CaravansComponent },
  { path: 'new-caravan', component: NewCaravanComponent },
  { path: 'edit-caravan/:id', component: EditCaravanComponent },
  { path: 'bookings', component: BookingsComponent },
  { path: 'new-booking/:caravanId', component: NewBookingComponent },
  { path: 'edit-booking/:id', component: EditBookingComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
