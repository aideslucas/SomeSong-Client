/**
 * Created by Eylam Milner on 5/5/2017.
 */
import {Component} from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';
import {Question} from '../../providers/question'
import {User} from "../../providers/user";
import {File} from "@ionic-native/file";
import * as firebase from 'firebase';
import {Genre} from "../../providers/genre";
import {Language} from "../../providers/language";
import {FacebookShare} from "../../providers/facebook-share";
import {FormBuilder, FormGroup, Validators} from '@angular/forms'

@Component({
  selector: 'page-upload-question',
  templateUrl: 'upload-question.html',
})

export class UploadQuestionPage {
  public selectedGenres: {};
  public selectedLanguages: {};
  private recordPath: string;
  private userID: string;
  private title: string;
  private uploadForm: FormGroup;
  public submitAttempt: boolean = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private question: Question,
              private user: User,
              private file: File,
              private viewController: ViewController,
              private facebookShare: FacebookShare,
              private formBuilder: FormBuilder) {

    this.title = '';
    this.selectedGenres = navParams.get('selectedGenres');
    this.selectedLanguages = navParams.get('selectedLanguages');

    this.uploadForm = formBuilder.group({
      recordingTitle: ['', Validators.required]
    })
  }

  public uploadRecording(): void {
    this.submitAttempt = true;
    let questionID = this.question.getNewQuestionID();
    this.saveRecordingToDB(questionID);
    this.saveRecordingToStorage(questionID);

    this.facebookShare.shareQuestion(questionID, this.title).then(() => {

    });

    this.viewController.dismiss();
  }

  private saveRecordingToDB(questionID: string): void {
    this.recordPath = `client-data/recordings/myRecording_${questionID}.amr`;
    this.user.currentUser.first().subscribe((data) => {
      this.userID = data.userID;

      this.question.writeNewQuestion(questionID, this.selectedGenres, this.selectedLanguages, null, this.recordPath, this.userID, this.title);
    });
  }

  private saveRecordingToStorage(questionID: string): void {
    let ref = firebase.storage().ref().child(`client-data/recordings/myRecording_${questionID}.amr`);
    let filePath = "file:///storage/emulated/0/";
    let fileName = "myRecording.amr";

    this.file.readAsArrayBuffer(filePath, fileName)
      .then((fileData) => {
        let blob = new Blob([fileData], {type: "audio/amr"});
        ref.put(blob)
          .then((_) => {
            alert(`Uploaded song!`);
          })
          .catch((error) => {
            alert(`could not upload file: ${JSON.stringify(error)}`)
          });
      })
      .catch((error) => {
        alert(`could not read file: ${JSON.stringify(error)}`);
      });
  }
}
