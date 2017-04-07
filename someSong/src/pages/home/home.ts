import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { LoginModalPage } from '../login-modal/login-modal'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController,
              public modalCtrl: ModalController) {

  }

  openLoginModal() {
    console.log('enter function');
    let modal = this.modalCtrl.create(LoginModalPage);
    modal.present();
  }

}
