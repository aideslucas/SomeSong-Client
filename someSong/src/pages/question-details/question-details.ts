import { Component } from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

import {MediaPlugin} from "@ionic-native/media";
import {Question} from "../../providers/question";
import {User} from "../../providers/user";
import {Answer} from "../../providers/answer";
import {Record} from "../../providers/record";
import DictionaryHelpFunctions from "../../assets/dictionaryHelpFunctions";

declare var Media: any;

@Component({
  selector: 'page-question-details',
  templateUrl: 'question-details.html'
})
export class QuestionDetailsPage {
  question: any;
  questionAnswers = {};
  questionUser: any;
  answer: any;
  playing: boolean = false;
  questionSubs: any;
  currentUser: any;
  answerLoading = true;
  questionTime: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private _media: MediaPlugin,
              private _question: Question,
              private _record: Record,
              private _user: User,
              private _answer: Answer)
  {
    this._user.currentUser.first().subscribe(data => {
      this.currentUser = data;
    });

    this.questionSubs = this._question.getQuestionDetails(navParams.data).subscribe(question => {
      this.question = question;
      this.questionTime = this._answer.getLocalTime(this.question.timeUTC);

    /*  this._record.getRecordURL(this.question.record).then(url => {
        this.question.file = new Media(url, ()=> {
        }, (e) => {
          alert("failed to create the recording file: " + JSON.stringify(e));
        });
      });*/

      this._user.getUser(this.question.user).then(user => {
        this.questionUser = user.val();
      });

      if (!this.question.answers) {
        this.answerLoading = false;
      }

      this._question.getQuestionAnswers(this.question.questionID).on('child_added', questionAnswer => {
        this._answer.getAnswerDetails(questionAnswer.key).subscribe((answerDetail) => {
          this.questionAnswers = DictionaryHelpFunctions.addToDictionary(this.questionAnswers, questionAnswer.key, answerDetail);
          this._user.getUser(answerDetail.user).then((userDetail) => {
            this.questionAnswers[questionAnswer.key].user = userDetail.val();
          });
          this.questionAnswers[questionAnswer.key].time = this._answer.getLocalTime(this.questionAnswers[questionAnswer.key].timeUTC);

          this.answerLoading = false;
        });
      });
    });
  }


  isEmpty(dictionary) {
    return DictionaryHelpFunctions.isEmpty(dictionary);
  }


  upVote(item, answer) {
    item.close();
    answer.votes++;

    this._answer.updateAnswer(answer);
  }

  downVote(item, answer) {
    item.close();
    answer.votes--;

    this._answer.updateAnswer(answer);
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
    this._answer.writeNewAnswer(this.answer, this.currentUser.userID, this.question.questionID);
    this.answer = '';
  }

  ionViewWillUnload() {
    this.questionSubs.unsubscribe();
  }
}
