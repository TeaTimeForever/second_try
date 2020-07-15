import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth, User } from 'firebase/app';
import { PilotProfile } from './userProfile/pilotProfile';
import { AngularFirestore } from '@angular/fire/firestore';

export type UserPublicData = Pick<PilotProfile, 'name' | 'surname' | 'wing' | 'wingClass' | 'gender'>;

export type UserPersonalData = Pick<PilotProfile, 'phone' | 'licenseId' | 'emergencyContactName' | 'emergencyContactPhone' | 'licenseCategory'>

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

