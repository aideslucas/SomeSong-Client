import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Question } from "../../providers/question";
import { QuestionDetailsPage } from "../question-details/question-details";

@Component({
  selector: 'page-browse-questions',
  templateUrl: 'browse-questions.html'
})
export class BrowseQuestionsPage {
  questions: any;
  user: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private _question: Question) {
    // If we navigated to this page, we will have an item available as a nav param
    this._question.getAllUnresolvedQuestions().then(data =>
    {
      var questionsDict = data.val();

      this.questions = [];

      for (var key in questionsDict) this.questions.push(questionsDict[key]);
    });
 }
  goToQuestion(questionID) {
    this.navCtrl.push(QuestionDetailsPage, questionID);
  }
}
