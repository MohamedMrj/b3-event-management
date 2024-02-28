import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Observable, ReplaySubject } from 'rxjs';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { UserAccount } from '../auth.interfaces';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

const USER_DATA: UserAccount[] = [
  { id: '1', userType: 'Admin', username: 'admin', firstName: 'Admin', lastName: 'Admin', phoneNumber: '123-456-7890', lastChanged: '2020-01-01' },
  { id: '2', userType: 'User', username: 'user', firstName: 'User', lastName: 'User', phoneNumber: '123-456-7890', lastChanged: '2020-01-01' },
  { id: '3', userType: 'User', username: 'user2', firstName: 'User2', lastName: 'User2', phoneNumber: '123-456-7890', lastChanged: '2020-01-01' },
  { id: '4', userType: 'User', username: 'user3', firstName: 'User3', lastName: 'User3', phoneNumber: '123-456-7890', lastChanged: '2020-01-01' },
  { id: '5', userType: 'User', username: 'user4', firstName: 'User4', lastName: 'User4', phoneNumber: '123-456-7890', lastChanged: '2020-01-01' },
  { id: '6', userType: 'User', username: 'user5', firstName: 'User5', lastName: 'User5', phoneNumber: '123-456-7890', lastChanged: '2020-01-01' },
];

@Component({
  selector: 'app-user-manage',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatTableModule, MatSortModule, MatPaginatorModule,],
  templateUrl: './user-manage.component.html',
  styleUrl: './user-manage.component.css'
})
export class UserManageComponent implements AfterViewInit {
  displayedColumns: string[] = ['userType', 'username', 'firstName', 'lastName', 'phoneNumber', 'lastChanged'];
  dataToDisplay = [...USER_DATA];

  dataSource = new MatTableDataSource(this.dataToDisplay);

  constructor(private _liveAnnouncer: LiveAnnouncer) { }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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

class ExampleDataSource extends DataSource<UserAccount> {
  private _dataStream = new ReplaySubject<UserAccount[]>();

  constructor(initialData: UserAccount[]) {
    super();
    this.setData(initialData);
  }

  connect(): Observable<UserAccount[]> {
    return this._dataStream;
  }

  disconnect() { }

  setData(data: UserAccount[]) {
    this._dataStream.next(data);
  }
}
