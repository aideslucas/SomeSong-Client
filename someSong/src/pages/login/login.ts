import {Component} from '@angular/core';
import {ModalController, NavController, Platform} from 'ionic-angular';

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
              public modalCtrl: ModalController,
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
                var user;
                this._user.currentUser.first().subscribe(data => {
                  user = data;
                })

                var languageModal = this.modalCtrl.create(LanguageSelectPage, { selectedLanguages: new Array<any>() });
                languageModal.onDidDismiss(data => {
                  user.languages = data;
                  var genreModal = this.modalCtrl.create(GenreSelectPage, { selectedGenres: new Array<any>() });
                  genreModal.onDidDismiss(data => {
                    user.genres = data;
                    this._user.updateUser(user);
                    this.navCtrl.setRoot(HomePage);
                  });

                  genreModal.present();
                });

                languageModal.present();
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
    this.authStateChanged();
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
