import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Question } from "../../providers/question";
import { QuestionDetailsPage } from "../question-details/question-details";
import {Genre} from "../../providers/genre";
import {Language} from "../../providers/language";

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
  filteredLanguages: any = [];
  languagesArray: any = [];
  languagesDict: any = [];

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
      this.genresDict = data.val();
      for (var key in this.genresDict) {
        this.genresArray.push(this.genresDict[key]);
      }
      this.filteredGenres = this.genresArray;
    });

    Language.getLanguages().then(data =>{
      this.languagesDict = data.val();
      for ( var key in this.languagesDict) {
        this.languagesArray.push(this.languagesDict[key]);
      }
      this.filteredLanguages = this.languagesArray;
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
    var filteredGenresKeys = this.valuesArrayToKeysArray(this.filteredGenres, this.genresDict);
    var filteredLanguagesKeys = this.valuesArrayToKeysArray(this.filteredLanguages, this.languagesDict);

    for (var i =0; i<this.questions.length; i++){
      if ( this.findOne(this.questions[i]["genres"],filteredGenresKeys) &&
            this.findOne(this.questions[i]["languages"],filteredLanguagesKeys)){
        enabledQuestions.push(this.questions[i]);
      }
    }

    return enabledQuestions;
  }

  valuesArrayToKeysArray(array, dict){
    var keysArray = [];
    for (var i=0; i<array.length; i++){
      var genreKey = this.getKeyByValue(dict, array[i]);
      keysArray.push(parseInt(genreKey));
    }
    return keysArray;
  }

  goToQuestion(questionID) {
    this.navCtrl.push(QuestionDetailsPage, questionID);
  }
}
