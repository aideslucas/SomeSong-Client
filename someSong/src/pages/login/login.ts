import {Component} from '@angular/core';
import {NavController, Platform} from 'ionic-angular';

import {Auth} from '../../providers/auth';
import {User} from "../../providers/user";

import {HomePage} from "../home/home";
import {LanguageSelectPage} from "../language-select/language-select";
import {RegisterPage} from "../register/register";
import {GenreSelectPage} from "../genre-select/genre-select";

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
              private _auth: Auth,
              private _user: User) {
    this.form = {
      email: '',
      password: ''
    };

    this.authStateChanged = this._auth.authState.onAuthStateChanged(authUser => {
      if (authUser != null) {
        this._user.logIn(authUser.uid);
        this._user.getUser(authUser.uid)
          .then(user => {
            if (user.val() == null) {
              var displayName, email, image;

              authUser.providerData.forEach(function (profile) {
                displayName = profile.displayName;
                email = profile.email;
                image = profile.photoURL;
              });

              this._user.createUser(authUser.uid, displayName, email, image).then(() =>
              {
                var pagesArr = new Array<any>();
                pagesArr.push(HomePage);
                pagesArr.push(GenreSelectPage);
                pagesArr.push(LanguageSelectPage);

                this.navCtrl.setPages(pagesArr);
              });
            }
            else
            {
              this.navCtrl.setRoot(HomePage);
            }
          });
      }
    });
  }

  loginWithEmail() {
    this._auth.signInWithEmail(this.form.email, this.form.password).catch(error => this.error = error);
  }

  register() {
    this.navCtrl.push(RegisterPage);
  }

  resetPassword() {

  }

  loginWithFB() {
    this._auth.signInWithFacebook();
  }

  ionViewWillUnload() {
    this.authStateChanged();
  }
}
