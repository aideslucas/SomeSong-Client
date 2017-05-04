import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { ProfilePage } from "../profile/profile";
import { QuestionDetailsPage } from "../question-details/question-details";
import { AskQuestionPage } from "../ask-question/ask-question";
import { BrowseQuestionsPage } from "../browse-questions/browse-questions";

import { User } from "../../providers/user";
import {Answer} from "../../providers/answer";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  user: any;
  userSubscription: any;

  constructor(public navCtrl: NavController,
              private _user: User,
              private _answer: Answer) {
    this.userSubscription = this._user.currentUser.subscribe((data) =>
    {
      this.user = data;

      var fullAnswers = new Array<any>();

      for (let answer of this.user.answers)
      {
        this._answer.getAnswerDetails(answer).then(data =>
        {
          fullAnswers.push(data.val());
        });
      }

      this.user.answers = fullAnswers;
    });
  }

  goToProfile(){
    this.userSubscription.unsubscribe();
    this.navCtrl.push(ProfilePage);
  }

  goToQuestion(questionID) {
    this.userSubscription.unsubscribe();
    this.navCtrl.push(QuestionDetailsPage, questionID);
  }

  askAQuestion() {
    this.userSubscription.unsubscribe();
    this.navCtrl.push(AskQuestionPage);
  }

  browseQuestions() {
    this.userSubscription.unsubscribe();
    this.navCtrl.push(BrowseQuestionsPage);
  }
}
