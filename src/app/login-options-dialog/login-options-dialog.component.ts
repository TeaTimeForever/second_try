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
      <div><button (click)="google()">Ielogoties ar Google</button></div>
      <div><button (click)="fb()">Ielogoties ar Facebook</button></div>
    </div>
  `,
  styles: []
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
    p.then(() => this.dialogRef.close());
  }
  google() {
    const p = this.data.userService.loginWithGoogle();
    this.data.loginCallback(p);
    p.then(() => this.dialogRef.close());
  }
}
