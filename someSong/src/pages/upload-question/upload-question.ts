/**
 * Created by Eylam Milner on 5/5/2017.
 */
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {Question} from '../../providers/question'
import * as firebase from 'firebase';

@Component({
  selector: 'page-upload-question',
  templateUrl: 'upload-question.html'
})
export class UploadQuestionPage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private question: Question) {
  }

  public uploadRecording(): void {
    this.saveRecordingToDB();
    this.saveRecordingToStorage();

  }

  private saveRecordingToDB(): void {
    this.question.writeNewQuestion()
  }

  private saveRecordingToStorage(): void {
    let ref = firebase.storage().ref().child(`client-data/recordings/myRecording_123.amr`);
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
}
