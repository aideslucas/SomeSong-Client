import {Component} from '@angular/core';
import {NavController, NavParams, AlertController} from 'ionic-angular';
import {File} from "@ionic-native/file";
import {FileChooser} from "@ionic-native/file-chooser";
import {FilePath} from "@ionic-native/file-path";
import * as firebase from 'firebase';
import {UploadQuestionPage} from "../upload-question/upload-question";

declare var Media: any;
declare var navigator: any;

@Component({
  selector: 'page-ask-question',
  templateUrl: 'ask-question.html'
})
export class AskQuestionPage {

  private recordingFile: any;
  private date: any = new Date();
  public recording: boolean = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public alertCtrl: AlertController,
              public file: File) {
  }

  public startRecording(): void {
    if (!this.recording) {
      this.recording = true;
      this.recordingFile = new Media("myRecording.amr", ()=> {
      }, (e) => {
        this.showAlert("fail to create the recording file: " + JSON.stringify(e));
      });
      this.recordingFile.startRecord();
    }
    else {
      this.recording = false;
      this.stopRecording();
      //this.navCtrl.push(UploadQuestionPage);
    }
  }

  public goToUploadPage(): void {
    this.navCtrl.push(UploadQuestionPage);
  }

  public stopRecording(): void {
    this.recordingFile.stopRecord();
    this.recordingFile.release();
  }

  public playRecording(): void {
    this.recordingFile.play();
  }

  public uploadRecording(): void {
    let ref = firebase.storage().ref().child(`client-data/recordings/myRecording_${this.getTimeStamp()}.amr`);
    let filePath = "file:///storage/emulated/0/";
    let fileName = "myRecording.amr";


    this.file.readAsArrayBuffer(filePath, fileName)
      .then((fileData) => {
        let blob = new Blob([fileData], {type: "audio/amr"});
        ref.put(blob)
          .then((_) => {
            this.showAlert(`Uploaded song!`);
          })
          .catch((error) => {
            this.showAlert(`could not upload file: ${JSON.stringify(error)}`)
          });
      })
      .catch((error) => {
        this.showAlert(`could not read file: ${JSON.stringify(error)}`);
      });

      //TODO: Can be used to track upload progress for progress bar
      /*    let uploadTask = ref.put(blob);
            uploadTask.on('state_changed', function(snapshot){
            // Observe state change events such as progress, pause, and resume
            // See below for more detail
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            alert('Upload is ' + progress + '% done');
          }, function(error) {
            // Handle unsuccessful uploads
            alert("Error uploading: " + error)
          }, function() {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            var downloadURL = uploadTask.snapshot.downloadURL;
            alert("Success!" + downloadURL);
          });*/
  }

  public chooseFile() {
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
  }

  private showAlert(message) {
    let alert = this.alertCtrl.create({
      title: 'INFO',
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

  private getTimeStamp(){
    return (this.date.getDate() + "_" +
            (this.date.getMonth() + 1) + "_" +
            this.date.getFullYear() + "@" +
            this.date.getHours() + ":" +
            this.date.getMinutes() + ":" +
            this.date.getSeconds());
  }
}
