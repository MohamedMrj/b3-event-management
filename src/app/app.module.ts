import { BrowserModule } from "@angular/platform-browser";
import { NgModule, LOCALE_ID } from "@angular/core";
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import localeSv from '@angular/common/locales/sv';
import localePl from '@angular/common/locales/pl';

import { AppComponent } from "./app.component";
import { EventCardComponent } from './event-card/event-card.component';
import { EventListComponent } from './event-list/event-list.component';
import { EventDetailComponent } from './event-detail/event-detail.component';
import { EventCreateComponent } from './event-create/event-create.component';
import { EventEditComponent } from './event-edit/event-edit.component';
import { ApiTestComponent } from './api-test/api-test.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { CreateEventFormComponent } from './create-event-form/create-event-form.component';

registerLocaleData(localeSv);
registerLocaleData(localePl);

@NgModule({
  declarations: [
    AppComponent,
    EventCardComponent,
    EventListComponent,
    EventDetailComponent,
    EventCreateComponent,
    EventEditComponent,
    ApiTestComponent,
    PageNotFoundComponent,
    CreateEventFormComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    MatToolbarModule,
    MatCardModule, 
    MatDividerModule, 
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatInputModule,
    BrowserAnimationsModule,
  ],
  bootstrap: [
    AppComponent
  ],
  providers: [
    { provide: LOCALE_ID, useValue: navigator.language || 'en'}
  ]
})
export class AppModule {}
