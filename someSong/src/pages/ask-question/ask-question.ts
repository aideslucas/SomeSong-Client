import {Component, Inject} from '@angular/core';
import {NavController, NavParams, Platform, AlertController} from 'ionic-angular';


import {FirebaseApp} from "angularfire2";
import * as firebase from 'firebase';

declare var Media: any;
declare var navigator: any;

var a;
var b;

@Component({
  selector: 'page-ask-question',
  templateUrl: 'ask-question.html'
})
export class AskQuestionPage {

  constructor(public _platform: Platform,
              public navCtrl: NavController,
              public navParams: NavParams,
              public alertCtrl: AlertController,
              @Inject(FirebaseApp) firebaseApp: firebase.app.App) {
  }

  public captureAudio() {
    navigator.device.capture.captureAudio(this.captureSuccess, this.captureError, {limit:1})
  }

  public captureSuccess(mediaFiles) {
    this.showAlert("Capture Success");
  }

  public captureError(err) {
    this.showAlert("Capture Error: " + err + " CODE: " + err.code);
  }

  public playSong() {
    a = new Media("http://themushroomkingdom.net/sounds/wav/drm64_mario2.wav", ()=> {
      this.showAlert("Stopped playing...")
      }, (e) => {
        this.showAlert("fail callback: " + JSON.stringify(e));
      });
    a.play()
  }

  public stopSong() {
    a.stop();
    a.release();
  }

  public startRecording(): void {
    b = new Media("myRecording.amr", ()=> {
      this.showAlert("Stopped Recording...")
    }, (e) => {
      this.showAlert("fail First callback: " + JSON.stringify(e));
    });
    b.startRecord();
    this.showAlert("Started Recording...")
  }

  public stopRecording(): void {
    b.stopRecord();
    b.release();
  }

  public playRecording(): void {
    b.play();
  }

  private uploadRecording(): void {
  }


  private getPathFileRecordAudio(): string {
    let path: string = (this._platform.is('ios') ? '../Library/NoCloud/' : '../Documents/');
    return path + 'myRecording' + '.mp3';
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
