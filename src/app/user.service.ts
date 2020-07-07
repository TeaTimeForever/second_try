import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private afAuth: AngularFireAuth) {}
  
  user$ = this.afAuth.user;

  loginWithGoogle() {
    return this.afAuth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  logout() {
    return this.afAuth.signOut();
  }

}

