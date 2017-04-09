import { Component } from '@angular/core';
import { Platform, ViewController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';


@Component({
  selector: 'page-login-modal',
  templateUrl: 'login-modal.html'
})
export class LoginModalPage {

  constructor(public platform: Platform,
              public viewCtrl: ViewController,
              private _auth: AuthService) {

  }

  loginWithFB() {
    this._auth.signInWithFacebook()
      .then(() => this.onSignInSuccess());
  }

  private onSignInSuccess(): void {
    this.dismiss();
  }

  dismiss(){
    this.viewCtrl.dismiss();
  }
}
