/**
 * Created by Eylam Milner on 5/31/2017.
 */
import {AlertController} from 'ionic-angular';
import {Injectable} from '@angular/core';

@Injectable()
export class Alert {
  constructor (private alertCtrl: AlertController) {
  }

  public showAlert(message) {
    let alert = this.alertCtrl.create({
      title: 'INFO',
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }
}
