import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth, User } from 'firebase/app';
import { PilotProfile } from './userProfile/pilotProfile';
import { MatDialog } from '@angular/material/dialog';
import { LoginOptionsDialogComponent, LoginOptionsDialogData } from './login-options-dialog/login-options-dialog.component';

export type UserPublicData = Pick<PilotProfile, 'name' | 'surname' | 'wing' | 'wingClass' | 'gender'>;

export type UserPersonalData = Pick<PilotProfile, 'phone' | 'licenseId' | 'emergencyContactName' | 'emergencyContactPhone'>

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private afAuth: AngularFireAuth,
    private dialog: MatDialog
  ) { }

  user$ = this.afAuth.user;

  login(): Promise<firebase.auth.UserCredential> {
    return new Promise((resolve, reject) => {
      const ref = this.dialog.open<LoginOptionsDialogComponent, LoginOptionsDialogData>(LoginOptionsDialogComponent, { width: '250px', height: '200px', data: { loginCallback: resolve, userService: this } });
      ref.afterClosed().subscribe(() => {
        reject(new Error('Atcelts'));
      });
    });
  }

  loginWithGoogle() {
    return this.afAuth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  loginWithFacebook() {
    return this.afAuth.signInWithPopup(new auth.FacebookAuthProvider());
  }

  logout() {
    return this.afAuth.signOut();
  }

  static extractPublicData({ name, surname, wing, wingClass, gender }: PilotProfile): UserPublicData {
    return { name, surname, wing, wingClass, gender };
  }

  static extractPersonalData({ phone, licenseId, emergencyContactName, emergencyContactPhone }: PilotProfile): UserPersonalData {
    return { phone, licenseId, emergencyContactName, emergencyContactPhone };
  }

  static initializeUserFromAuth({ displayName, phoneNumber }: User): PilotProfile {
    const [name, surname = ''] = (displayName || '').split(' ');
    return {
      name,
      surname,
      gender: '',
      phone: phoneNumber || '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      licenseId: '',
      wing: '',
      wingClass: 'A',
    };
  }
}

