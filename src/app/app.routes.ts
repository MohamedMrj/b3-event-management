import { Routes } from '@angular/router';
import { EventListComponent } from './event-list/event-list.component';
import { EventDetailComponent } from './event-detail/event-detail.component';
import { EventCreateComponent } from './event-create/event-create.component';
import { EventEditComponent } from './event-edit/event-edit.component';
import { UserCreateComponent } from './user-create/user-create.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { AuthGuardService } from './auth.guard';
import { AdminGuardService } from './admin.guard';
import { EventCreatorOrAdminGuardService } from './event-creator-or-admin.guard';
import { AdminComponent } from './admin/admin.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, title: 'Logga in' },
  {
    path: 'event/create',
    component: EventCreateComponent,
    title: 'Skapa event',
    canActivate: [AuthGuardService],
  },
  {
    path: 'event/update/:eventid',
    component: EventEditComponent,
    title: 'Redigera event',
    canActivate: [AuthGuardService, EventCreatorOrAdminGuardService],
  },
  {
    path: 'event/:eventid',
    component: EventDetailComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'admin',
    component: AdminComponent,
    title: 'Admin',
    canActivate: [AdminGuardService],
  },
  {
    path: 'admin/users/create',
    component: UserCreateComponent,
    title: 'Skapa användare',
    canActivate: [AdminGuardService],
  },
  {
    path: 'admin/users/update/:userid',
    component: UserEditComponent,
    title: 'Redigera användare',
    canActivate: [AdminGuardService],
  },
  {
    path: '',
    component: EventListComponent,
    title: 'Events',
    canActivate: [AuthGuardService],
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent,
    title: 'Obehörig',
  },
  {
    path: '**',
    component: PageNotFoundComponent,
    title: 'Sidan kunde inte hittas',
  },
];
