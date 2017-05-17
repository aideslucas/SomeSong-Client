import {ChangeDetectorRef, Component, OnDestroy} from '@angular/core';
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
  userQuestions : { [id: string] : any} = {};
  userAnswers = {};
  userSubscription: any;

  constructor(public navCtrl: NavController,
              private ref: ChangeDetectorRef,
              private _user: User,
              private _answer: Answer,
              private _question: Question) {
    this.userSubscription = this._user.currentUser.subscribe((data) =>
    {
      this.user = data;

      this._user.getUserQuestions(this.user.userID).on('child_added', userQuestion => {
        this._question.getQuestionDetails(userQuestion.key).subscribe((questionDetail) => {
          this.userQuestions = this.addToDictionary(this.userQuestions, userQuestion.key, questionDetail);
        });
      });

      this._user.getUserAnswers(this.user.userID).on('child_added', userAnswer => {
        this._answer.getAnswerDetails(userAnswer.key).subscribe((answerDetail) => {
          this.userAnswers = this.addToDictionary(this.userAnswers, userAnswer.key, answerDetail);
          this._question.getQuestionDetails(answerDetail.question).subscribe((questionDetail) => {
            this.userAnswers[userAnswer.key].question = questionDetail;
            //this.userAnswers = this.updateDictionary(this.userAnswers);
          });
        });
      });
    });
  }

  addToDictionary (oldDict,new_key,new_val){
    var newDict = {};
    for (let key of Object.keys(oldDict)) {
      newDict[key] = oldDict[key];
    }
    newDict[new_key] = new_val;
    return newDict;
  };

  updateDictionary (dictionary) {
    var newDict = {};
    for (let key of Object.keys(dictionary)) {
      newDict[key] = dictionary[key];
    }
    return newDict;
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
