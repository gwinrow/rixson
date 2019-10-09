import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';

import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './in-memory-data.service';

import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatRippleModule } from '@angular/material/core';

import { MarkdownModule } from 'ngx-markdown';
import { NgxGalleryModule } from 'ngx-gallery';
import { CookieService } from 'ngx-cookie-service';

import { ShareModule } from './share.module';

import { CaravanService } from './caravan.service';
import { BookingService } from './booking.service';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { BreakPointsService } from './break-points.service';

import { HomeComponent } from './home/home.component';
import { PricesComponent } from './prices/prices.component';
import { InfoComponent } from './info/info.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { ViewCaravanComponent } from './view-caravan/view-caravan.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PricesComponent,
    InfoComponent,
    AboutComponent,
    ContactComponent,
    ViewCaravanComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    // The HttpClientInMemoryWebApiModule module intercepts HTTP requests
    // and returns simulated server responses.
    // Remove it when a real server is ready to receive requests.
    HttpClientInMemoryWebApiModule.forRoot(
      InMemoryDataService, { dataEncapsulation: false }
    ),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    BrowserAnimationsModule,
    ShareModule,
    MarkdownModule.forRoot(),
    NgxGalleryModule,
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatCheckboxModule,
    MatGridListModule,
    MatTooltipModule,
    MatChipsModule,
    MatListModule,
    MatExpansionModule,
    MatDividerModule,
    MatRippleModule
  ],
  providers: [
    CaravanService,
    BookingService,
    AuthService,
    UserService,
    BreakPointsService,
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
