import { Injectable } from '@angular/core';
import { Facebook } from  '@ionic-native/facebook';
import firebase from 'firebase';
import { Platform } from 'ionic-angular';

@Injectable()
export class Auth {

  constructor(public facebook: Facebook, public platform: Platform) {
  }

  get authState() {
    return firebase.auth();
  }

  createUserWithEmail(email: string, password: string) : firebase.Promise<any> {
    return firebase.auth().createUserWithEmailAndPassword(email, password);
  }

  signInWithEmail(email:string, password: string): firebase.Promise<any> {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  signInWithFacebook(): firebase.Promise<any> {
    if (this.platform.is('cordova'))
    {
      this.facebook.login(['email']).then((response) => {
        const facebookCredential = firebase.auth.FacebookAuthProvider
          .credential(response.authResponse.accessToken);

        return firebase.auth().signInWithCredential(facebookCredential).catch(error => { console.log(error)});
      }).catch((error) => { console.log(error) });
    }
    else
    {
      var provider = new firebase.auth.FacebookAuthProvider();
      provider.addScope('email');
      provider.setCustomParameters({
        'display': 'popup'
      });

      return firebase.auth().signInWithPopup(provider).catch(function(error) {
        console.log(error);
      });
    }
  }

  signOut(): void {
    firebase.auth().signOut();
  }
}
