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
              private _genres: Genre,
              private _languages: Language) {

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

    this._genres.getGenres().once('value').then(data =>{
      this.genresDict = data.val();
      for (var key in this.genresDict) {
        this.genresArray.push(this.genresDict[key]);
      }
      console.log(this.genresArray);
      // TODO: change filters to only users preffered genres.
      this.filteredGenres = this.genresArray;
    });

    this._languages.getLanguages().once('value').then(data =>{
      this.languagesDict = data.val();
      console.log("language dict is - " + this.languagesDict);
      for ( var key in this.languagesDict) {
        this.languagesArray.push(this.languagesDict[key]);
      }
      this.filteredLanguages = this.languagesArray;
    });

  }

  // Functions
  // TODO: this function should be in utils file.
  // getKeyByValue(object, value) {
  //   return Object.keys(object).find(key => object[key] === value);
  // }
  //
  // findOne(haystack, arr) {
  //   return arr.some(function (v) {
  //     return haystack.indexOf(v) >= 0;
  //   });
  // }

  static similarDictAndArrays(arrayOne, arrayTwo){
    for (var key in arrayOne){
      if (arrayTwo.indexOf(arrayOne[key]) > -1){
        return true;
      }
    }

    return false
  }

  getAllEnabledQuestions(){
    var enabledQuestions = [];

    for (var i =0; i<this.questions.length; i++){
      console.log("genres of question - " + this.questions[i]['genres']);
      if (BrowseQuestionsPage.similarDictAndArrays(this.questions[i]['genres'],this.filteredGenres) &&
          BrowseQuestionsPage.similarDictAndArrays(this.questions[i]['languages'],this.filteredLanguages)){
        enabledQuestions.push(this.questions[i]);
      }
    }
    return enabledQuestions;
  }

  // valuesArrayToKeysArray(array, dict){
  //   var keysArray = [];
  //   for (var i=0; i<array.length; i++){
  //     var genreKey = this.getKeyByValue(dict, array[i]);
  //     keysArray.push(parseInt(genreKey));
  //   }
  //   return keysArray;
  // }

  goToQuestion(questionID) {
    this.navCtrl.push(QuestionDetailsPage, questionID);
  }
}
