import {Component, Inject} from '@angular/core';
import {NavController, NavParams, Platform, AlertController} from 'ionic-angular';


import {FirebaseApp} from "angularfire2";
import * as firebase from 'firebase';

declare var Media: any;
declare var navigator: any;

@Component({
  selector: 'page-ask-question',
  templateUrl: 'ask-question.html'
})
export class AskQuestionPage {

  private recordingFile: any;

  constructor(public _platform: Platform,
              public navCtrl: NavController,
              public navParams: NavParams,
              public alertCtrl: AlertController,
              @Inject(FirebaseApp) firebaseApp: firebase.app.App) {
  }

  public startRecording(): void {
    this.recordingFile = new Media("myRecording.amr", ()=> {
      this.showAlert("Stopped...")
    }, (e) => {
      this.showAlert("fail to create the recording file: " + JSON.stringify(e));
    });
    this.recordingFile.startRecord();
    this.showAlert("Started Recording...")
  }

  public stopRecording(): void {
    this.recordingFile.stopRecord();
    this.recordingFile.release();
  }

  public playRecording(): void {
    this.recordingFile.play();
  }

  private uploadRecording(): void {
  }

  showAlert(message) {
    let alert = this.alertCtrl.create({
      title: 'INFO',
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }
}
