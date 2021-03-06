import { Component, Inject } from '@angular/core';
import { UserService } from '../user.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface LoginOptionsDialogData {
  loginCallback: (p: Promise<firebase.auth.UserCredential>) => void,
  userService: UserService
}

@Component({
  selector: 'app-login-options-dialog',
  template: `
    <div mat-dialog-content>
      <div><button class="loginbtn google" (click)="google()">
        <img src="./assets/google.png" alt="">Ielogoties ar Google</button></div>
      <div><button class="loginbtn fb" (click)="fb()">
        <img src="./assets/fb.png"  alt="">Ielogoties ar Facebook</button></div>
    </div>
  `,
  styleUrls: ['./login-options-dialog.component.scss']
})
export class LoginOptionsDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    private data: LoginOptionsDialogData,
    private dialogRef: MatDialogRef<LoginOptionsDialogComponent>,
  ) { }
  fb() {
    const p = this.data.userService.loginWithFacebook();
    this.data.loginCallback(p);
    p.finally(() => this.dialogRef.close());
  }
  google() {
    const p = this.data.userService.loginWithGoogle();
    this.data.loginCallback(p);
    p.finally(() => this.dialogRef.close());
  }
}
