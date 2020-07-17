import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth, User } from 'firebase/app';
import { PilotProfile } from './userProfile/pilotProfile';
import { MatDialog } from '@angular/material/dialog';
import { LoginOptionsDialogComponent, LoginOptionsDialogData } from './login-options-dialog/login-options-dialog.component';
import { AngularFirestore } from '@angular/fire/firestore';
import { switchMap, map } from 'rxjs/operators';
import { of } from 'rxjs';

export type UserPublicData = Pick<PilotProfile, 'name' | 'surname' | 'wing' | 'wingClass' | 'gender'>;

export type UserPersonalData = Pick<PilotProfile, 'phone' | 'licenseId' | 'emergencyContactName' | 'emergencyContactPhone' | 'licenseCategory'> & { isAdmin?: boolean }

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private afAuth: AngularFireAuth,
    private dialog: MatDialog,
    private afs: AngularFirestore
  ) { }

  user$ = this.afAuth.user;

  /** A stream returning whether currently logged in user is admin */
  isAdmin$ = this.user$.pipe(
    switchMap(user =>
      user === null ? of(false) :
        this.afs.doc<UserPersonalData>(`users/${user.uid}/personal/contacts`).valueChanges().pipe(
          map(c => c ? (c.isAdmin || false) : false)
        ))
  )

  login(): Promise<firebase.auth.UserCredential> {
    return new Promise((resolve, reject) => {
      const ref = this.dialog.open<LoginOptionsDialogComponent, LoginOptionsDialogData>(
        LoginOptionsDialogComponent,
        { width: '300px', height: 'fit-content', data: { loginCallback: resolve, userService: this } });
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

  static extractPersonalData({ phone, licenseId, emergencyContactName, emergencyContactPhone, licenseCategory }: PilotProfile): UserPersonalData {
    return { phone, licenseId, emergencyContactName, emergencyContactPhone, licenseCategory };
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
      licenseCategory: 'B',
      licenseId: '',
      wing: '',
      wingClass: 'A',
    };
  }
}

