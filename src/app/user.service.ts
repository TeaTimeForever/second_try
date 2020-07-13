import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { Observable } from 'rxjs';

export interface UserPublicData {
  name: string,
  surname: string,
  wing: string,
  wingClass: 'A' | 'B' | 'C' | 'D' | 'other'
}

export interface UserPersonalData {
  phone: string,
  phoneNr: string,
  emergencyContactName: string,
  emergencyContactPhone: string,
}

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

}

