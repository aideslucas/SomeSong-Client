import { Component } from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {BackendService, User} from "../../providers/backend-service";
import {ProfilePage} from "../profile/profile";
import {QuestionDetailsPage} from "../question-details/question-details";
import {AskQuestionPage} from "../ask-question/ask-question";
import {BrowseQuestionsPage} from "../browse-questions/browse-questions";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  user: any;
  userSubscription: any;

  constructor(public navCtrl: NavController,
              private backEnd: BackendService) {
    this.user = { image: '' };
    this.userSubscription = this.backEnd.getCurrentUser().subscribe((data) =>
    {
      this.user = data;
    })
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
