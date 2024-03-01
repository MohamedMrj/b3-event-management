import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule, MatButton, MatIconButton } from '@angular/material/button';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon'
import { MatSnackBar } from '@angular/material/snack-bar';
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
    MatFormFieldModule, MatInputModule, MatButtonModule, MatTableModule, MatSortModule, MatPaginatorModule, MatIconModule, DateFormatPipe, MatButton, MatIconButton, MatMenuTrigger, MatMenu, MatMenuItem,
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
    private snackBar: MatSnackBar,
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
    this.userService.getAllUsers().subscribe({
      next: (response) => {
        if (response.success) {
          // Assign the data part of the response to the dataSource
          this.dataSource.data = response.data;
        } else {
          // Handle the case where the API response indicates failure
          console.error('Failed to fetch users:', response.message);
          this.snackBar.open('Failed to fetch users.', 'Close', {
            duration: 3000,
          });
        }
      },
      error: (error) => {
        console.error('Error fetching users:', error);
        this.snackBar.open('Error fetching users.', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  deleteUser(user: UserAccount) {
    this.userService.deleteUser(user.id).subscribe({
      next: () => {
        console.log(`User: ${user.id} deleted successfully.`);
        this.snackBar.open('Användare raderad.', 'Stäng', {
          duration: 3000,
        });
        this.deleteUserFromTable(user);
      },
      error: (error) => {
        console.error('Error deleting user:', error);
        this.snackBar.open('Fel vid radering av användare', 'Stäng', {
          duration: 3000,
        });
      },
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

  // Function to delete a user from the table
  deleteUserFromTable(user: UserAccount) {
    this.dataSource.data = this.dataSource.data.filter(u => u.id !== user.id);
  }
}
