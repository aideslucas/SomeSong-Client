/**
 * Created by Lucas on 01/05/2017.
 */
import {NavController, LoadingController} from 'ionic-angular';
import {Component} from '@angular/core';

import {AuthService} from "../../providers/auth-service";
import {LoginPage} from "../login/login";
import {BackendService} from "../../providers/backend-service";
import {LanguageSelectPage} from "../language-select/language-select";

@Component({
  templateUrl: 'register.html',
  selector: 'page-register',
})

export class RegisterPage {
  error: any;
  form: any;
  newUser: any;
  loading: any;
  authStateChanged: any;

  constructor(private navCtrl: NavController,
              private auth: AuthService,
              private _backend: BackendService,
              private loadingCtrl: LoadingController,) {
    this.form = {
      email: '',
      password: '',
      repassword: '',
      displayName: ''
    };

    this.authStateChanged = this.auth.authState.onAuthStateChanged(authUser => {
      if (authUser != null) {
        this.loading.dismiss();
        this.authStateChanged();
        this.navCtrl.setRoot(LanguageSelectPage, this.newUser);
      }
    });
  }

  openLoginPage(): void {
    this.authStateChanged();
    this.navCtrl.setRoot(LoginPage);
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

    this.auth.createUserWithEmail(this.form.email, this.form.password).then(registerData => {
      this.newUser = this._backend.createUser(registerData.uid, this.form.displayName, this.form.email, "https://freeiconshop.com/wp-content/uploads/edd/person-solid.png");
      this.auth.signInWithEmail(this.form.email, this.form.password).catch(loginError => {
        this.loading.dismiss();
        this.error = loginError;
      });
    }, registerError => {
      this.loading.dismiss();
      this.error = registerError;
    });
  }
}
