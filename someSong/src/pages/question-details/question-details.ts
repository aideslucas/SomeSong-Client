import { Component } from '@angular/core';
import {LoadingController, NavController, NavParams} from 'ionic-angular';
import {BackendService, Genres, Languages} from "../../providers/backend-service";
import {MediaObject, MediaPlugin} from "@ionic-native/media";

@Component({
  selector: 'page-question-details',
  templateUrl: 'question-details.html'
})
export class QuestionDetailsPage {
  question: any;
  genres = Genres;
  languages = Languages;
  answer: any;
  playing: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private backEnd: BackendService, private media: MediaPlugin) {
    const onStatusUpdate = (status) => console.log(status);
    const onSuccess = () => console.log('Action is successful.');
    const onError = (error) => console.log(error.message);
    this.answer = '';

    this.question = {
      genres : new Array<Genres>(),
      languages: new Array<Languages>(),
      location: 'location',
      answers: new Array<any>(),
      user: {
        image: '',
        displayName: ''
      },
      file: ''
    };

    this.backEnd.getQuestionDetails(navParams.data).then(question => {
      this.question = question.val();
      this.question.answers = new Array<any>();

      this.backEnd.getRecordURL(this.question.record).then(url => {
       // this.question.file = this.media.create(url, onStatusUpdate, onSuccess, onError);
      });

      this.backEnd.getUser(this.question.user).then(user => {
        this.question.user = user.val();
      });

      for (let answer of question.val().answers)
      {
        this.backEnd.getAnswerDetails(answer).then(ans => {
          var answer = ans.val();
          this.backEnd.getUser(answer.user).then(user => {
            answer.user = user.val();

            this.question.answers.push(answer);
          });
        });
      }
    });
  }

  playRecording() {
    if (this.playing)
    {
      //this.question.file.pause();
      this.playing = false;
    }
    else {
      //this.question.file.play();
      this.playing = true;
    }
  }

  sendAnswer() {
    this.backEnd.writeNewAnswer(this.answer, this.question.user.userID, this.question.questionID);
  }
}
