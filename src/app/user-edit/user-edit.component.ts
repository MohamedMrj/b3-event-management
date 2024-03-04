import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { UserService } from '../user.service';
import { UserAccount } from '../auth.interfaces';
import { NgIf, Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserFormComponent } from '../user-form/user-form.component';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
  standalone: true,
  imports: [
    MatButton,
    MatIcon,
    MatIconButton,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
    UserFormComponent,
    NgIf,
  ],
})
export class UserEditComponent implements OnInit {
  user!: UserAccount;
  userNotFound: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private userService: UserService,
    private pageLocation: Location,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) { }

  @ViewChild(UserFormComponent) userFormComponent!: UserFormComponent;

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const userId = params.get('userid');
      if (userId) {
        this.fetchUser(userId);
      }
    });
  }

  fetchUser(userId: string) {
    this.userService.getUser(userId).subscribe({
      next: (response) => {
        if (response.data) {
          this.user = response.data as UserAccount;
          this.titleService.setTitle(`Redigerar: ${this.user.username}`);
          this.userNotFound = false;
        } else {
          throw new Error('User data not found');
        }
      },
      error: () => {
        this.userNotFound = true;
        this.titleService.setTitle('Användare hittades ej');
        this.snackBar.open('Användare hittades ej', 'Stäng', { duration: 3000 });
      },
    });
  }

  deleteUser() {
    if (this.user?.id) {
      const confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: { title: 'Radera användare', message: 'Är du säker på att du vill radera denna användare?' },
      });

      confirmDialogRef.afterClosed().subscribe((confirmed) => {
        if (confirmed) {
          this.userService.deleteUser(this.user.id).subscribe({
            next: () => {
              this.snackBar.open('Användaren har raderats', 'Stäng', { duration: 3000 });
              this.router.navigate(['/admin']);
            },
            error: () => {
              this.snackBar.open('Fel vid radering av användare', 'Stäng', { duration: 3000 });
            },
          });
        }
      });
    }
  }

  goBack() {
    this.pageLocation.back();
  }

  confirmDiscardChanges() {
    if (this.userFormComponent.isFormDirty) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: 'Lämna sidan',
          message: 'Vill du lämna sidan? Ändringar har inte sparats.',
        },
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.goBack();
        }
      });
    } else {
      this.goBack();
    }
  }
}
