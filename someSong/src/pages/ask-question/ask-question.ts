import {Component, Inject} from '@angular/core';
import {NavController, NavParams, Platform} from 'ionic-angular';

import {MediaObject, MediaPlugin} from '@ionic-native/media';
import {FirebaseApp} from "angularfire2";
import * as firebase from 'firebase';

@Component({
  selector: 'page-ask-question',
  templateUrl: 'ask-question.html'
})
export class AskQuestionPage {
  storageRef : any;
  mediaFile: any;
  fileRecord: any;
  pathFile: string;
  nameFile: string;

  constructor(public _platform: Platform,
              public navCtrl: NavController,
              public navParams: NavParams,
              private media: MediaPlugin,
              @Inject(FirebaseApp) firebaseApp: firebase.app.App ) {
    this.storageRef = firebaseApp.storage().ref();
    this.mediaFile = this.storageRef.child('recordings/recordid.mp3');
  }

  public startRecording(): void {
    this.pathFile = this.getPathFileRecordAudio();
    this.fileRecord = this.media.create(this.pathFile)
      .then((file: MediaObject) => {
        file.startRecord();
        this.fileRecord = file;
      });
  }

  public stopRecording(): void {
    this.fileRecord.stopRecord();
  }

  private startPlay(): void {
   // this.fileRecord = new MediaPlugin(this.pathFile);
    this.fileRecord.play();
  }

  private uploadRecording(): void {
    this.mediaFile.put(this.fileRecord);
  }


  private getPathFileRecordAudio(): string {
    let path: string = (this._platform.is('ios') ? '../Library/NoCloud/' : '../Documents/');
    return path + this.nameFile + '-' + '.mp3';
  }
}
