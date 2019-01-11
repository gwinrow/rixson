import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { CaravansComponent } from './caravans/caravans.component';
import { NewCaravanComponent } from './new-caravan/new-caravan.component';
import { EditCaravanComponent } from './edit-caravan/edit-caravan.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'caravans', component: CaravansComponent },
  { path: 'new-caravan', component: NewCaravanComponent },
  { path: 'edit-caravan/:id', component: EditCaravanComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
