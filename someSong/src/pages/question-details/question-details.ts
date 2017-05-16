import { Component } from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

import {MediaPlugin} from "@ionic-native/media";
import {Question} from "../../providers/question";
import {User} from "../../providers/user";
import {Answer} from "../../providers/answer";
import {Record} from "../../providers/record";

declare var Media: any;

@Component({
  selector: 'page-question-details',
  templateUrl: 'question-details.html'
})
export class QuestionDetailsPage {
  question: any;
  answer: any;
  playing: boolean = false;
  questionSubs: any;

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

    this.questionSubs = this._question.getQuestionDetails(navParams.data).subscribe(question => {
      this.question = question;

      var answers = new Array<any>();

      this._record.getRecordURL(this.question.record).then(url => {
        this.question.file = new Media(url, ()=> {
        }, (e) => {
          alert("failed to create the recording file: " + JSON.stringify(e));
        });
      });

      this._user.getUser(this.question.user).then(user => {
        this.question.user = user.val();
      });

      if (question.answers)
      {
        for (let answer of question.answers)
        {
          this._answer.getAnswerDetails(answer).then(ans => {
            var answer = ans.val();

            answer.time = this._answer.getLocalTime(answer.timeUTC);

            this._user.getUser(answer.user).then(user => {
              answer.user = user.val();

              answers.push(answer);
            });
          });
        }
      }

      this.question.answers = answers;
    });
  }

  upVote(item, answer) {
    item.close();
    answer.votes++;

    this._answer.updateAnswer(answer).then(data => {
      this._user.getUser(answer.user).then(user => {
        answer.user = user.val();
      });
    });
  }

  downVote(item, answer) {
    item.close();
    answer.votes--;

    this._answer.updateAnswer(answer).then(data => {
      this._user.getUser(answer.user).then(user => {
        answer.user = user.val();
      });
    });
  }

  resolve(item, answer) {
    item.close();

    this.question.correctAnswer = answer.answerID;

    this._question.updateQuestion(this.question);
  }

  playRecording() {
    if (this.playing)
    {
      this.question.file.pause();
      this.playing = false;
    }
    else {
      this.question.file.play();
      this.playing = true;
    }
  }

  sendAnswer() {
    this._answer.writeNewAnswer(this.answer, this.question.user.userID, this.question.questionID);
    this.answer = '';
  }

  ionViewWillUnload() {
    this.questionSubs.unsubscribe();
  }
}
