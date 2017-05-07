import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Question } from "../../providers/question";
import { QuestionDetailsPage } from "../question-details/question-details";
import {Genre} from "../../providers/genre";

@Component({
  selector: 'page-browse-questions',
  templateUrl: 'browse-questions.html'
})
export class BrowseQuestionsPage {
  questions: any;
  user: any;
  genrs: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private _question: Question,
              private _genrs: Genre) {
    console.log("llalala");
    // If we navigated to this page, we will have an item available as a nav param
    this._question.getAllUnresolvedQuestions().then(data =>
    {
      var questionsDict = data.val();

      this.questions = [];

      for (var key in questionsDict) this.questions.push(questionsDict[key]);
    });

    this._genrs.getGenres().then(data =>{
      this.genrs = [];
      var genrsDict = data.val();
      for (var key in genrsDict) this.genrs.push(genrsDict[key]);
    });
  console.log(this.genrs);

  }
  goToQuestion(questionID) {
    this.navCtrl.push(QuestionDetailsPage, questionID);
  }
}
