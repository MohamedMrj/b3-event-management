import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'
import { UserAccount } from '../auth.interfaces';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { UserService } from '../user.service';
import { DateFormatPipe } from '../date-format.pipe';
import localeSv from '@angular/common/locales/sv';

@Component({
  selector: 'app-user-manage',
  standalone: true,
  imports: [
    MatFormFieldModule, MatInputModule, MatButtonModule, MatTableModule,
    MatSortModule, MatPaginatorModule, MatIconModule, DateFormatPipe,
  ],
  templateUrl: './user-manage.component.html',
  styleUrls: ['./user-manage.component.css']
})
export class UserManageComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['userType', 'username', 'firstName', 'lastName', 'phoneNumber', 'lastModified', 'actions'];
  dataSource = new MatTableDataSource<UserAccount>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private userService: UserService,
  ) {
    registerLocaleData(localeSv);
  }

  ngOnInit() {
    this.fetchUsers();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  fetchUsers() {
    this.userService.getAllUsers().subscribe(users => {
      this.dataSource.data = users;
    });
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
