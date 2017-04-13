import { Injectable, Inject } from '@angular/core';
import { AuthProviders, AngularFireAuth, FirebaseAuthState, AuthMethods } from 'angularfire2';

import {FirebaseApp} from "angularfire2";
import * as firebase from 'firebase';

@Injectable()
export class AuthService {
  public authState: any;

  constructor(@Inject(FirebaseApp) firebaseApp: firebase.app.App ) {
    this.authState = firebaseApp.auth();
  }

  authenticated(): boolean {
    return false;
    return this.authState !== null;
  }

  signInWithFacebook(): firebase.Promise<FirebaseAuthState> {
    return this.authState.login({
      provider: AuthProviders.Facebook,
      method: AuthMethods.Popup
    });
  }

  signInWithGoogle(): firebase.Promise<FirebaseAuthState> {
    return this.auth$.login({
      provider: AuthProviders.Google,
      method: AuthMethods.Popup
    });
  }

  signOut(): void {
    this.auth$.logout();
  }
}
