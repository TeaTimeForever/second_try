import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth, User } from 'firebase/app';
import { PilotProfile } from './userProfile/pilotProfile';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, zip } from 'rxjs';

export type UserPublicData = Pick<PilotProfile, 'name' | 'surname' | 'wing' | 'wingClass'>;

export type UserPersonalData = Pick<PilotProfile, 'phone' | 'licenseId' | 'emergencyContactName' | 'emergencyContactPhone'>

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore) { }

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

  static initializeUserFromAuth({ displayName, phoneNumber }: User): PilotProfile {
    const [name, surname = ''] = (displayName || '').split(' ');
    return {
      name,
      surname,
      phone: phoneNumber || '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      licenseId: '',
      wing: '',
      wingClass: 'A',
    };
  }
}

