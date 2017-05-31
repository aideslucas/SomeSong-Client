/**
 * Created by Eylam Milner on 5/31/2017.
 */
import {AlertController} from 'ionic-angular';
import {Injectable} from '@angular/core';

@Injectable()
export class Alert {
  constructor (private alertCtrl: AlertController) {
  }

  public showAlert(title: string, message: string, buttonText: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: [buttonText]
    });
    alert.present();
  }
}
