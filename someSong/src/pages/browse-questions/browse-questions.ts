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
      console.log(this.questions);
    }));


    promises.push(this._genres.getGenres().once('value').then(data => {
      this.genresDict = data.val();
      for (var key in this.genresDict) {
        this.genresArray.push(this.genresDict[key]);
      }
      console.log(this.genresArray);
      // TODO: change filters to only users preffered genres.
      this.filteredGenres = this.genresArray;
    }));

    promises.push(this._languages.getLanguages().once('value').then(data => {
      this.languagesDict = data.val();
      console.log("language dict is - " + this.languagesDict);
      for (var key in this.languagesDict) {
        this.languagesArray.push(this.languagesDict[key]);
      }
      this.filteredLanguages = this.languagesArray;
    }));

    Promise.all(promises).then( values=> {
        this.getAllEnabledQuestions();
        console.log(this.questions);
      }).catch(reason => {
        console.log(reason);
    });
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
      console.log("genres of question - " + this.questions[i]['genres']);
      if (BrowseQuestionsPage.similarDictAndArrays(this.questions[i]['genres'],this.filteredGenres) &&
          BrowseQuestionsPage.similarDictAndArrays(this.questions[i]['languages'],this.filteredLanguages)){
        this.enabledQuestions.push(this.questions[i]);
      }
    }

    if (!this.searchQuery) {
      return this.enabledQuestions;
    }

    console.log("Query is ----------- " + this.searchQuery);

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
