import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ContactComponent } from './contact/contact.component';
import { AuthGuard } from './auth.guard';
import { ViewCaravanComponent } from './view-caravan/view-caravan.component';
import { ViewPageComponent } from './view-page/view-page.component';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'view-page/:id', component: ViewPageComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'view-caravan/:id', component: ViewCaravanComponent },
  { path: 'admin', loadChildren: './admin/admin.module#AdminModule', canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/home' }
];
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
