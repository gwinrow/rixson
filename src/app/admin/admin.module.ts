import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MarkdownModule } from 'ngx-markdown';

import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatChipsModule } from '@angular/material/chips';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { TextFieldModule } from '@angular/cdk/text-field';

import { ShareModule } from '../share.module';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CaravansComponent } from './caravans/caravans.component';
import { EditCaravanComponent } from './edit-caravan/edit-caravan.component';
import { NewCaravanComponent } from './new-caravan/new-caravan.component';
import { BookingsComponent } from './bookings/bookings.component';
import { NewBookingComponent } from './new-booking/new-booking.component';
import { EditBookingComponent } from './edit-booking/edit-booking.component';
import { BookingCaravanComponent } from './booking-caravan/booking-caravan.component';
import { EditSettingsComponent } from './edit-settings/edit-settings.component';
import { PagesComponent } from './pages/pages.component';
import { NewPageComponent } from './new-page/new-page.component';
import { EditPageComponent } from './edit-page/edit-page.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MarkdownModule.forRoot(),
    AdminRoutingModule,
    ShareModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatChipsModule,
    DragDropModule,
    TextFieldModule
  ],
  declarations: [
    DashboardComponent,
    CaravansComponent,
    EditCaravanComponent,
    NewCaravanComponent,
    BookingsComponent,
    NewBookingComponent,
    EditBookingComponent,
    BookingCaravanComponent,
    EditSettingsComponent,
    PagesComponent,
    NewPageComponent,
    EditPageComponent
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
  ],
})
export class AdminModule { }
