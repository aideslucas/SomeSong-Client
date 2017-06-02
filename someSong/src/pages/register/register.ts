/**
 * Created by Lucas on 01/05/2017.
 */
import {LoadingController, ViewController} from 'ionic-angular';
import {Component} from '@angular/core';

import {Auth} from "../../providers/auth";
import {User} from "../../providers/user";

@Component({
  templateUrl: 'register.html',
  selector: 'page-register',
})

export class RegisterPage {
  error: any;
  form: any;
  loading: any;

  constructor(private viewController: ViewController,
              private _auth: Auth,
              private _user: User,
              private loadingCtrl: LoadingController)
  {
    this.form = {
      email: '',
      password: '',
      repassword: '',
      displayName: ''
    };
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
      this._user.createUser(registerData.uid, this.form.displayName, this.form.email, "https://freeiconshop.com/wp-content/uploads/edd/person-solid.png");
      this.closeModal();
    }, registerError => {
      this.loading.dismiss();
      this.error = registerError;
    });
  }

  closeModal() {
    this.loading.dismiss();
    this.viewController.dismiss();
  }
}
