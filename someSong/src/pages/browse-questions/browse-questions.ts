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
  enabledQuestions: any = [];
  searchQuery: any = "";

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private _question: Question,
              private _genres: Genre,
              private _languages: Language) {

    var promises = [];
    // If we navigated to this page, we will have an item available as a nav param
    promises.push(this._question.getAllUnresolvedQuestions().then(data => {
      var questionsDict = data.val();

      this.questions = [];

      for (var key in questionsDict) {
        var question = questionsDict[key];
        question["enabled"] = true;
        this.questions.push(question);
      }
      console.log("Questions are - " + this.questions);
      this.questions.sort(function(a,b){
        return BrowseQuestionsPage.createDateFromQuestion(a) < BrowseQuestionsPage.createDateFromQuestion(b);
      });
      console.log("Ordered Questions are - " + this.questions);
    }));


    promises.push(this._genres.getGenres().orderByValue().once('value').then(data => {
      this.genresDict = data.val();
      for (var key in this.genresDict) {
        this.genresArray.push(this.genresDict[key]);
      }
      this.genresArray.sort();

      // TODO: change filters to only users preffered genres.
      this.filteredGenres = this.genresArray;
    }));

    promises.push(this._languages.getLanguages().orderByValue().once('value').then(data => {
      this.languagesDict = data.val();
      for (var key in this.languagesDict) {
        this.languagesArray.push(this.languagesDict[key]);
      }
      this.languagesArray.sort();
      this.filteredLanguages = this.languagesArray;
    }));

    Promise.all(promises).then( values=> {
        this.getAllEnabledQuestions();
      }).catch(reason => {
        console.log(reason);
    });
  }

  static createDateFromQuestion(question){
    var time = question['timeUTC'];
    return new Date(time['year'],time['month'],time['date'],time['hours'],time['minutes'],time['seconds'])
  }
  // Functions
  // TODO: this function should be in utils file.

  static similarDictAndArrays(arrayOne, arrayTwo){
    for (var key in arrayOne){
      if (arrayTwo.indexOf(arrayOne[key]) > -1){
        return true;
      }
    }
    return false
  }

  getAllEnabledQuestions(){
    // var enabledQuestions = [];
    this.enabledQuestions = [];
    for (var i =0; i<this.questions.length; i++){
      if (BrowseQuestionsPage.similarDictAndArrays(this.questions[i]['genres'],this.filteredGenres) &&
          BrowseQuestionsPage.similarDictAndArrays(this.questions[i]['languages'],this.filteredLanguages)){
        this.enabledQuestions.push(this.questions[i]);
      }
    }

    if (!this.searchQuery) {
      return this.enabledQuestions;
    }

    this.enabledQuestions = this.enabledQuestions.filter((v) => {
      if(v.title && this.searchQuery) {
        return v.title.toLowerCase().indexOf(this.searchQuery.toLowerCase()) > -1;
      }
    });
    return this.enabledQuestions;
  }

  goToQuestion(questionID) {
    this.navCtrl.push(QuestionDetailsPage, questionID);
  }
}
