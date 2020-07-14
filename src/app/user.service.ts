import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { PilotProfile } from './userProfile/pilotProfile';

export type UserPublicData = Pick<PilotProfile, 'name' | 'surname' | 'wing' | 'wingClass'>;

export type UserPersonalData = Pick<PilotProfile, 'phone' | 'licenseId' | 'emergencyContactName' | 'emergencyContactPhone'>

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private afAuth: AngularFireAuth) { }

  user$ = this.afAuth.user;

  loginWithGoogle() {
    return this.afAuth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  logout() {
    return this.afAuth.signOut();
  }

  static extractPublicData({ name, surname, wing, wingClass }: PilotProfile): UserPublicData {
    return { name, surname, wing, wingClass };
  }

  static extractPersonalData({ phone, licenseId, emergencyContactName, emergencyContactPhone }: PilotProfile): UserPersonalData {
    return { phone, licenseId, emergencyContactName, emergencyContactPhone };
  }
}

