import { Component } from '@angular/core';

import { Platform, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-login-modal',
  templateUrl: 'login-modal.html'
})
export class LoginModalPage {

   constructor(public platform: Platform,
               public viewCtrl: ViewController) {

   }

  dismiss(){
    this.viewCtrl.dismiss();
  }
}
