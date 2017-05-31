import {Component} from '@angular/core';
import {NavController, NavParams, AlertController, ModalController} from 'ionic-angular';
import {File} from "@ionic-native/file";
import {UploadQuestionPage} from "../upload-question/upload-question";
import {LanguageSelectPage} from "../language-select/language-select";
import {GenreSelectPage} from "../genre-select/genre-select";
import {User} from "../../providers/user";

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
              private user: User) {
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
    /*   this.recordingFile = new Media("myRecording.amr", ()=> {
     }, (e) => {
     this.showAlert("failed to create the recording file: " + JSON.stringify(e));
     });
     this.recordingFile.startRecord();*/
  }

  public stopRecording(): void {
    /*   this.recordingFile.stopRecord();
     this.recordingFile.release();*/
    this.startUploadProcess();

  }

  public playRecording(): void {
    this.recordingFile.play();
  }

  public startUploadProcess(): void {

    this.user.currentUser.first().subscribe((userData) => {

      let languageModal = this.modalCtrl.create(LanguageSelectPage, {selectedLanguages: userData.languages});
      languageModal.onDidDismiss((data) => {

        this.selectedLanguages = data;
        let genreModal = this.modalCtrl.create(GenreSelectPage, {selectedGenres: userData.genres});

        genreModal.onDidDismiss(data => {

          this.selectedGenres = data;
          let uploadModal = this.modalCtrl.create(UploadQuestionPage, {
            selectedGenres: this.selectedGenres,
            selectedLanguages: this.selectedLanguages
          });

          uploadModal.onDidDismiss(() => {
          });

          uploadModal.present();
        });

        genreModal.present();
      });

      languageModal.present();
    });
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
      clearInterval(this.progressBarInterval)
    }
  }
}
