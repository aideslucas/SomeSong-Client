/**
 * Created by Lucas on 01/05/2017.
 */
import {NavController, LoadingController} from 'ionic-angular';
import {Component} from '@angular/core';

import {Auth} from "../../providers/auth";

import {LoginPage} from "../login/login";
import {LanguageSelectPage} from "../language-select/language-select";
import {User} from "../../providers/user";
import {GenreSelectPage} from "../genre-select/genre-select";
import {HomePage} from "../home/home";

@Component({
  templateUrl: 'register.html',
  selector: 'page-register',
})

export class RegisterPage {
  error: any;
  form: any;
  loading: any;
  authStateChanged: any;

  constructor(private navCtrl: NavController,
              private _auth: Auth,
              private _user: User,
              private loadingCtrl: LoadingController,) {
    this.form = {
      email: '',
      password: '',
      repassword: '',
      displayName: ''
    };

    this.authStateChanged = this._auth.authState.onAuthStateChanged(authUser => {
      if (authUser != null) {
        this.loading.dismiss();
        this.authStateChanged();
        this._user.logIn(authUser.uid);

        var pagesArr = new Array<any>();
        pagesArr.push(HomePage);
        pagesArr.push(GenreSelectPage);
        pagesArr.push(LanguageSelectPage);

        this.navCtrl.setPages(pagesArr);
      }
    });
  }

  register() {
    if (this.form.password != this.form.repassword) {
      this.error = "Passwords do not match";
      return;
    }

    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();

    this._auth.createUserWithEmail(this.form.email, this.form.password).then(registerData => {
      this._user.createUser(registerData.uid, this.form.displayName, this.form.email, "https://freeiconshop.com/wp-content/uploads/edd/person-solid.png").then(() => {
        this._auth.signInWithEmail(this.form.email, this.form.password).catch(loginError => {
          this.loading.dismiss();
          this.error = loginError;
        });
      });
    }, registerError => {
      this.loading.dismiss();
      this.error = registerError;
    });
  }

  ionViewWillUnload() {
    this.authStateChanged();
  }
}
