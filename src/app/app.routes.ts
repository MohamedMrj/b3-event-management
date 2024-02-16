import { Routes } from '@angular/router';
import { EventListComponent } from './event-list/event-list.component';
import { EventDetailComponent } from './event-detail/event-detail.component';
import { EventCreateComponent } from './event-create/event-create.component';
import { EventEditComponent } from './event-edit/event-edit.component';
import { ApiTestComponent } from './api-test/api-test.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { MyEventsComponent } from './my-events/my-events.component';
import { AuthGuardService } from './auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, title: 'Logga In' },
  { path: 'event/create', component: EventCreateComponent, title: 'Skapa Event', canActivate: [AuthGuardService] },
  { path: 'event/update/:eventid', component: EventEditComponent, title: 'Redigera Event', canActivate: [AuthGuardService] },
  { path: 'event/:eventid', component: EventDetailComponent, canActivate: [AuthGuardService] },
  { path: 'api-test', component: ApiTestComponent, title: 'API Test', canActivate: [AuthGuardService] },
  { path: 'my-events', component: MyEventsComponent, title: 'Mina Event', canActivate: [AuthGuardService] },
  { path: '', component: EventListComponent, title: 'Event', canActivate: [AuthGuardService] },
  { path: '**', component: PageNotFoundComponent, title: 'Sidan kunde inte hittas' },
];
