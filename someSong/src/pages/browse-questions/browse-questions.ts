import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Question } from "../../providers/question";

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
    console.log("llalala");
    // If we navigated to this page, we will have an item available as a nav param
    this._question.getAllQuestions().then(data =>
    {
      var questionsDict = data.val();

      this.questions = [];
      
      for (var key in questionsDict) this.questions.push(questionsDict[key]);

      console.log(this.questions);
    });
  }
}
