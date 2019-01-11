import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AngularFireStorageModule } from '@angular/fire/storage';

import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';

import { TextFieldModule } from '@angular/cdk/text-field';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CaravansComponent } from './caravans/caravans.component';
import { EditCaravanComponent } from './edit-caravan/edit-caravan.component';
import { NewCaravanComponent } from './new-caravan/new-caravan.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AdminRoutingModule,
    AngularFireStorageModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    TextFieldModule
  ],
  declarations: [DashboardComponent, CaravansComponent, EditCaravanComponent, NewCaravanComponent]
})
export class AdminModule { }
