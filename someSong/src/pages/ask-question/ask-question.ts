import {Component} from '@angular/core';
import {NavController, NavParams, AlertController, ModalController} from 'ionic-angular';
import {File} from "@ionic-native/file";
import {UploadQuestionPage} from "../upload-question/upload-question";
import {LanguageSelectPage} from "../language-select/language-select";
import {GenreSelectPage} from "../genre-select/genre-select";

declare var Media: any;
declare var navigator: any;

@Component({
  selector: 'page-ask-question',
  templateUrl: 'ask-question.html'
})
export class AskQuestionPage {

  private recordingFile: any;
  public recording: boolean = false;
  private selectedLanguages: any = new Array<number>();
  private selectedGenres: any = new Array<number>();

  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              public file: File,
              private modalCtrl: ModalController) {
  }

  public startRecording(): void {
    if (!this.recording) {
      this.recording = true;
      this.recordingFile = new Media("myRecording.amr", ()=> {
      }, (e) => {
        this.showAlert("failed to create the recording file: " + JSON.stringify(e));
      });
      this.recordingFile.startRecord();
    }
    else {
      this.recording = false;
      this.stopRecording();
      this.startUploadProcess();
    }
  }

  public stopRecording(): void {
    this.recordingFile.stopRecord();
    this.recordingFile.release();
  }

  public playRecording(): void {
    this.recordingFile.play();
  }

  public startUploadProcess(): void {
    let languageModal = this.modalCtrl.create(LanguageSelectPage, {selectedLanguages: new Array<any>()});

    languageModal.onDidDismiss((data) => {
      this.selectedLanguages = data;
      let genreModal = this.modalCtrl.create(GenreSelectPage, {selectedGenres: new Array<any>()});

      genreModal.onDidDismiss(data => {
        this.selectedGenres = data;
        let uploadModal = this.modalCtrl.create(UploadQuestionPage, {
          selectedGenres: this.selectedGenres,
          selectedLanguages: this.selectedLanguages
        });

        uploadModal.onDidDismiss(() => {
          this.showAlert("Uploaded Song!");
        });

        uploadModal.present();
      });

      genreModal.present();
    });

    languageModal.present();
  }

/*  public chooseFile() {
    new FileChooser().open()
      .then((uri) => {
        this.showAlert(`File native path: ${uri}`);
        new FilePath().resolveNativePath(uri)
          .then((resolvedURI) => {
            this.showAlert(`File resolved path: ${resolvedURI}`);
          });
      })
      .catch((error) => {
        this.showAlert(`could not choose file: ${JSON.stringify(error)}`);
      })
  }*/

  private showAlert(message) {
    let alert = this.alertCtrl.create({
      title: 'INFO',
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }
}
