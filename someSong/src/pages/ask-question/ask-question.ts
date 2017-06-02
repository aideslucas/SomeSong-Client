import {Component} from '@angular/core';
import {NavController, ModalController, Platform} from 'ionic-angular';
import {File} from "@ionic-native/file";
import {UploadQuestionPage} from "../upload-question/upload-question";
import {LanguageSelectPage} from "../language-select/language-select";
import {GenreSelectPage} from "../genre-select/genre-select";
import {User} from "../../providers/user";
import {Alert} from '../../providers/alert';
import {QuestionDetailsPage} from "../question-details/question-details";
import {HomePage} from "../home/home";

declare var Media: any;
declare var navigator: any;

@Component({
  selector: 'page-ask-question',
  templateUrl: 'ask-question.html'
})
export class AskQuestionPage {

  private recordingFile: any;
  public recording: boolean = false;
  private selectedLanguages: any = {};
  private selectedGenres: any = {};
  private miliSecond: number;
  private second: number;
  private zeroPlaceholder: boolean;
  private progress: number = 0;
  private progressBarInterval: number;
  private timeCounterInterval: number;

  constructor(public navCtrl: NavController,
              public file: File,
              private modalCtrl: ModalController,
              private user: User,
              private alert: Alert,
              public platform: Platform) {
  }

  public RecordingToggle(): void {
    if (!this.recording) {
      this.recording = true;
      this.startTimeCounter();
      this.startProgressBar();
      this.startRecording()

    }
    else {
      this.recording = false;
      this.clearTimeCounter();
      this.clearProgressBar();
      this.stopRecording();
    }
  }

  public startRecording() {
    if (this.platform.is('mobileweb') || this.platform.is('core')) {
      console.log("Running in browser, not really recording.");
    }
    else {
      this.recordingFile = new Media("myRecording.amr", ()=> {
      }, (e) => {
        this.alert.showAlert('OOPS...', `failed to create the recording file: " ${JSON.stringify(e)}`, 'OK');
      });
      this.recordingFile.startRecord();
    }
  }

  public stopRecording(): void {
    if (this.platform.is('mobileweb') || this.platform.is('core')) {
      this.startUploadProcess();
    }
    else {
      this.recordingFile.stopRecord();
      this.recordingFile.release();
      this.startUploadProcess();
    }
  }

  public startUploadProcess(): void {
    let upload = this.modalCtrl.create(UploadQuestionPage);

    upload.onDidDismiss((data) => {
      if (data == "home") {
        this.navCtrl.popToRoot();
      }
      else if (data == "ask") {

      }
      else {
        this.navCtrl.setPages([{"page": HomePage}, {"page": QuestionDetailsPage, "params": data}]);
      }
    });

    upload.present();
  }

  private startTimeCounter(): void {
    this.second = 0;
    this.zeroPlaceholder = true;
    this.miliSecond = 0;

    this.timeCounterInterval = setInterval(() => {
      this.miliSecond++;
      if (this.miliSecond === 99) {
        this.miliSecond = 0;
        this.second++;
      }
      if (this.second === 59) {
        this.second = 0;
      }
      if (this.second === 10) {
        this.zeroPlaceholder = false;
      }
      else if (this.second === 15) {
        this.clearTimeCounter();
        this.stopRecording();
      }
    }, 10);
  }

  private startProgressBar(): void {
    this.progressBarInterval = setInterval(() => {
      if ((this.progress / 100) !== 1) {
        this.progress++;
      }
    }, 150);
  }

  private clearTimeCounter() {
    if (this.timeCounterInterval) {
      clearInterval(this.timeCounterInterval)
    }
  }

  private clearProgressBar() {
    if (this.progressBarInterval) {
      this.progress = 0;
      clearInterval(this.progressBarInterval)
    }
  }
}
