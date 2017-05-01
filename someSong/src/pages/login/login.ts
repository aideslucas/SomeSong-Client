import {Component} from '@angular/core';
import {NavController, Platform} from 'ionic-angular';
import {AuthService} from '../../providers/auth-service';
import {BackendService} from '../../providers/backend-service'
import {HomePage} from "../home/home";
import {LanguageSelectPage} from "../language-select/language-select";
import {RegisterPage} from "../register/register";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  form: any;
  error: any;
  authStateChanged: any;

  constructor(public platform: Platform,
              public navCtrl: NavController,
              private _auth: AuthService,
              private _backend: BackendService) {
    this.form = {
      email: '',
      password: ''
    };

    this.authStateChanged = this._auth.authState.onAuthStateChanged(authUser => {
      if (authUser != null) {
        this._backend.getUser(authUser.uid)
          .then(user => {
            if (user.val() == null) {
              var displayName, email, image;

              authUser.providerData.forEach(function (profile) {
                displayName = profile.displayName;
                email = profile.email;
                image = profile.photoURL;
              });

              var newUser = this._backend.createUser(authUser.uid, displayName, email, image);

              this.navCtrl.setRoot(LanguageSelectPage, newUser);
            }
            else
              this.navCtrl.setRoot(HomePage, user.val());
          });
      }
    });
  }

  loginWithEmail() {
    this._auth.signInWithEmail(this.form.email, this.form.password).catch(error => this.error = error);
  }

  register() {
    this.authStateChanged();
    this.navCtrl.push(RegisterPage);
  }

  resetPassword() {

  }

  loginWithFB() {
    this._auth.signInWithFacebook();
  }

}
