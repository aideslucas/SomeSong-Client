import { Component } from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

import {MediaPlugin} from "@ionic-native/media";
import {Question} from "../../providers/question";
import {User} from "../../providers/user";
import {Answer} from "../../providers/answer";
import {Record} from "../../providers/record";

@Component({
  selector: 'page-question-details',
  templateUrl: 'question-details.html'
})
export class QuestionDetailsPage {
  question: any;
  genres: any;
  languages: any;
  answer: any;
  playing: boolean = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private _media: MediaPlugin,
              private _question: Question,
              private _record: Record,
              private _user: User,
              private _answer: Answer)
  {
    const onStatusUpdate = (status) => console.log(status);
    const onSuccess = () => console.log('Action is successful.');
    const onError = (error) => console.log(error.message);

    this.answer = '';

    this.question = {
      genres : new Array<any>(),
      languages: new Array<any>(),
      location: 'location',
      answers: new Array<any>(),
      user: {
        image: '',
        displayName: ''
      },
      file: ''
    };

    this._question.getQuestionDetails(navParams.data).then(question => {
      this.question = question.val();
      this.question.answers = new Array<any>();

      this._record.getRecordURL(this.question.record).then(url => {
       // this.question.file = this.media.create(url, onStatusUpdate, onSuccess, onError);
      });

      this._user.getUser(this.question.user).then(user => {
        this.question.user = user.val();
      });

      for (let answer of question.val().answers)
      {
        this._answer.getAnswerDetails(answer).then(ans => {
          var answer = ans.val();
          this._user.getUser(answer.user).then(user => {
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
    this._answer.writeNewAnswer(this.answer, this.question.user.userID, this.question.questionID);
  }
}
