import { Injectable } from '@angular/core';
import { AuthProviders, AngularFireAuth, FirebaseAuthState, AuthMethods } from 'angularfire2';
import { Facebook } from  '@ionic-native/facebook';
import * as firebase from 'firebase';
import { Platform } from 'ionic-angular';

@Injectable()
export class AuthService {
  public authState: FirebaseAuthState;

  constructor(public auth$: AngularFireAuth, public facebook: Facebook, public platform: Platform) {
    this.authState = auth$.getAuth();
    auth$.subscribe((state: FirebaseAuthState) => {
      this.authState = state;
    });
  }

  get authenticated(): boolean {
    return this.authState !== null;
  }

  signInWithFacebook(): firebase.Promise<any> {
    if (this.platform.is('cordova'))
    {
      return this.facebook.login(['email']).then( (response) => {
        const facebookCredential = firebase.auth.FacebookAuthProvider
          .credential(response.authResponse.accessToken);

        return firebase.auth().signInWithCredential(facebookCredential);
      }).catch((error) => { console.log(error) });
    }
    else
    {
      return this.auth$.login({
        provider: AuthProviders.Facebook,
        method: AuthMethods.Popup
      });
    }
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
