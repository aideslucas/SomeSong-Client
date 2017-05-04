import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { ProfilePage } from "../profile/profile";
import { QuestionDetailsPage } from "../question-details/question-details";
import { AskQuestionPage } from "../ask-question/ask-question";
import { BrowseQuestionsPage } from "../browse-questions/browse-questions";

import { User } from "../../providers/user";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  user: any;
  userSubscription: any;

  constructor(public navCtrl: NavController,
              private _user: User) {
    this.user = { image: '' };
    this.userSubscription = this._user.currentUser.subscribe((data) =>
    {
      this.user = data;
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
