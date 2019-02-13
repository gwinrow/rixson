import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatRippleModule } from '@angular/material/core';
import { CalendarComponent } from './calendar/calendar.component';
import { MonthComponent } from './calendar/month/month.component';

@NgModule({
  imports: [
    CommonModule,
    MatRippleModule
  ],
  declarations: [
    CalendarComponent,
    MonthComponent
  ],
  exports: [
    CalendarComponent,
    MonthComponent
  ]
})
export class ShareModule { }
