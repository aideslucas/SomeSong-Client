import {Component, OnDestroy} from '@angular/core';
import { NavController } from 'ionic-angular';

import { ProfilePage } from "../profile/profile";
import { QuestionDetailsPage } from "../question-details/question-details";
import { AskQuestionPage } from "../ask-question/ask-question";
import { BrowseQuestionsPage } from "../browse-questions/browse-questions";

import { User } from "../../providers/user";
import {Answer} from "../../providers/answer";
import {Question} from "../../providers/question";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  user: any;
  userSubscription: any;

  constructor(public navCtrl: NavController,
              private _user: User,
              private _answer: Answer,
              private _question: Question) {
    this.userSubscription = this._user.currentUser.subscribe((data) =>
    {
      this.user = data;

      if (this.user.questions) {
        var fullQuestions = new Array<any>();

        for (let question of this.user.questions)
        {
          this._question.getQuestionDetails(question).subscribe(data =>
          {
            fullQuestions.push(data);
          });
        }

        fullQuestions.sort(function (a, b){
          if (a.correctAnswer && b.correctAnswer) {
            return a.questionID-b.questionID;
          }
          else if (a.correctAnswer) {
            return 1;
          }
          else if (b.correctAnswer) {
            return -1;
          }
          else {
            return a.questionID-b.questionID;
          }
        });
        this.user.questions = fullQuestions;
      }

      if (this.user.answers) {
        var fullAnswers = new Array<any>();

        for (let answer of this.user.answers)
        {
          this._answer.getAnswerDetails(answer).first().subscribe(data =>
          {
            var fullAnswer = data;

            this._answer.getAnswerDetails(answer).subscribe(ansdata =>
            {
              var ansIndex = this.user.answers.findIndex(x => x.answerID == ansdata.answerID);
              this._question.getQuestionDetails(ansdata.question).first().subscribe(qdata => {
                ansdata.question = qdata;
                this.user.answers[ansIndex] = ansdata;
              });
            });

            this._question.getQuestionDetails(fullAnswer.question).subscribe(data => {
              fullAnswer.question = data;
              fullAnswers.push(fullAnswer);
            });
          });
        }

        this.user.answers = fullAnswers;
      }
    });
  }

  goToProfile(){
    this.navCtrl.push(ProfilePage);
  }

  goToQuestion(questionID) {
    this.navCtrl.push(QuestionDetailsPage, questionID);
  }

  askAQuestion() {
    this.navCtrl.push(AskQuestionPage);
  }

  browseQuestions() {
    this.navCtrl.push(BrowseQuestionsPage);
  }

  ionViewWillUnload() {
    this.userSubscription.unsubscribe();
  }
}
