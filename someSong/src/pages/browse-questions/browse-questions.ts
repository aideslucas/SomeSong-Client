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
  genresDict: any;
  genresArray: any = [];
  filteredGenres: any = [];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private _question: Question,
              private _genres: Genre) {

    // If we navigated to this page, we will have an item available as a nav param
    this._question.getAllUnresolvedQuestions().then(data =>
    {
      var questionsDict = data.val();

      this.questions = [];

      for (var key in questionsDict) {
        var question=questionsDict[key];
        question["enabled"]=true;
        this.questions.push(question);
      }
      console.log(this.questions);
    });

    this._genres.getGenres().then(data =>{
      console.log("lalala");
      this.genresDict = data.val();
      for (var key in this.genresDict) this.genresArray.push(this.genresDict[key]);
      console.log(this.genresDict);
    });

  }

  // Functions
  // TODO: this function should be in utils file.
  getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
  }

  findOne (haystack, arr) {
    return arr.some(function (v) {
    return haystack.indexOf(v) >= 0;
    });
  }

  getAllEnabledQuestions(){
    console.log(this.questions);
    var enabledQuestions = [];
    var filteredGenresKeys = this.arrayGenresToKeysGenres(this.filteredGenres);
    console.log(filteredGenresKeys);
    for (var i =0; i<this.questions.length; i++){
      var b = this.findOne(this.questions[i]["genres"],filteredGenresKeys);
      console.log(this.questions[i]["genres"]);
      console.log(filteredGenresKeys);
      console.log(b);
      if ( !b){
        enabledQuestions.push(this.questions[i]);
      }
    }

    console.log(enabledQuestions);
    return enabledQuestions;
  }

  arrayGenresToKeysGenres(genresNamesArray){
    var genresKeyArray = [];
    for (var i=0; i<genresNamesArray.length; i++){
      var genreKey = this.getKeyByValue(this.genresDict, genresNamesArray[i]);
      genresKeyArray.push(parseInt(genreKey));
    }

    return genresKeyArray;
  }

  goToQuestion(questionID) {
    this.navCtrl.push(QuestionDetailsPage, questionID);
  }
}
