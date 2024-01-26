import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EventListComponent } from './event-list/event-list.component';
import { EventDetailComponent } from './event-detail/event-detail.component';
import { EventCreateComponent } from './event-create/event-create.component';
import { EventEditComponent } from './event-edit/event-edit.component';
import { ApiTestComponent } from './api-test/api-test.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  { path: '', component: EventListComponent },
  { path: 'event/:eventid', component: EventDetailComponent },
  { path: 'event/create', component: EventCreateComponent },
  { path: 'event/update/:eventid', component: EventEditComponent },
  { path: 'api-test', component: ApiTestComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
