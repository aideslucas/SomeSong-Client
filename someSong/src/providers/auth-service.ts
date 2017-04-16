import { Injectable } from '@angular/core';
import { AuthProviders, AngularFireAuth, FirebaseAuthState, AuthMethods } from 'angularfire2';
import { Facebook } from "@ionic-native/facebook";
import {AlertController, Platform} from "ionic-angular";
import firebase from 'firebase';
import {BackendService} from "./backend-service";

@Injectable()
export class AuthService {
  public authState: any;

  constructor(private platform: Platform,
              private firebaseApp: AngularFireAuth,
              private facebook: Facebook,
              private alertCtrl: AlertController) {
    this.authState = firebaseApp.getAuth();
  }

  authenticated(): boolean {
    return this.authState !== null;
  }

  signInWithFacebook() : firebase.Promise<FirebaseAuthState> {
    if (this.platform.is('cordova')) {
      this.facebook.logout().then(()=>{
      this.facebook.login(['email', 'public_profile']).then(res => {
        this.alertCtrl.create({title: "test", subTitle: "test"}).present();
        const facebookCredential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
        this.alertCtrl.create({title: "test", subTitle: JSON.stringify(facebookCredential)}).present();
        return this.authState.signInWithCredential(facebookCredential)
          .then(a => {
          this.alertCtrl.create({title: "test", subTitle: JSON.stringify(a)}).present();
          });
      }).catch(error => {this.alertCtrl.create({title: "error", subTitle: error}).present()});});
    } else {
      return this.firebaseApp.login({
        provider: AuthProviders.Facebook,
        method: AuthMethods.Popup
      });
    }


  }

  signInWithGoogle(): firebase.Promise<FirebaseAuthState> {
    return this.firebaseApp.login({
      provider: AuthProviders.Google,
      method: AuthMethods.Popup
    });
  }

  signOut(): void {
    this.firebaseApp.logout();
  }
}
