import { Component } from '@angular/core';
import { UserManageComponent } from '../user-manage/user-manage.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [UserManageComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

}
