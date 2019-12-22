import { AlertComponent } from './../shared/alert/alert.component';
import { AuthService } from './../auth/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  isAuthenticated = false;
  private userSub: Subscription;
  constructor(private authService: AuthService, public dialog: MatDialog) { }

  ngOnInit() {
    this.userSub = this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }

  onLogout() {
    let dialogRef = this.dialog.open(AlertComponent, {
      data:
      {
        confirmationMessage: "Do you want to logout?",
        affirmative: "Stay logged in",
        negative: "Log Out"
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (JSON.parse(result)) {
        this.authService.logout();
      }
    });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
