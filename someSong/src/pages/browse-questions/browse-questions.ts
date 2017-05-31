import {Component} from '@angular/core';
import {AlertController, ModalController, NavController, NavParams} from 'ionic-angular';
import {Question} from "../../providers/question";
import {QuestionDetailsPage} from "../question-details/question-details";
import {Genre} from "../../providers/genre";
import {Language} from "../../providers/language";
import {FilterModalPage} from "../filter-modal/filter-modal";
import {User} from "../../providers/user";
import DictionaryHelpFunctions from "../../assets/dictionaryHelpFunctions";

@Component({
  selector: 'page-browse-questions',
  templateUrl: 'browse-questions.html'
})
export class BrowseQuestionsPage {
  selectedFilters = {
    selectedLanguages: {},
    selectedGenres: {},
    selectedAnswers: "All",
    selectedFriends: "All",
    selectedLocation: "",
    selectedTitle: ""
  };

  questions: { [id: string]: any } = {};
  questionLoading = true;
  orderBy = "";

  unresolvedQuestions: any;
  user: any;
  genresDict: any;
  genresArray: any = [];
  filteredGenres: any = [];
  filteredLanguages: any = [];
  languagesArray: any = [];
  languagesDict: any = [];
  enabledQuestions: any = [];
  resolved: any = false;
  searchQuery: any = "";
  resolvedQuestions: any = [];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private modalCtrl: ModalController,
              public alertCtrl: AlertController,
              private _user: User,
              private _question: Question,
              private _genres: Genre,
              private _languages: Language) {

    this._user.currentUser.first().subscribe(data => {
      this.selectedFilters.selectedLanguages = data.languages;
      this.selectedFilters.selectedGenres = data.genres;
    });

    this._question.getAllQuestions().then(data => {
      this.questions = data.val();
      this.questionLoading = false;
    });
/*
    var promises = [];

    // If we navigated to this page, we will have an item available as a nav param
    promises.push(this._question.getAllUnresolvedQuestions().then(data => {
      var questionsDict = data.val();

      this.unresolvedQuestions = [];

      for (var key in questionsDict) {
        var question = questionsDict[key];
        question["enabled"] = true;
        this.unresolvedQuestions.push(question);
      }
      this.unresolvedQuestions.sort(function (a, b) {
        return BrowseQuestionsPage.createDateFromQuestion(a) < BrowseQuestionsPage.createDateFromQuestion(b);
      });
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

    promises.push(this._question.getResolvedQuestions().then(data => {
      this.updateResolvedQuestionsFromData(data)
    }));

    Promise.all(promises).then(values => {
      this.getAllEnabledQuestions();
    }).catch(reason => {
      console.log(reason);
    });*/
  }
/*
  static createDateFromQuestion(question) {
    var time = question['timeUTC'];
    return new Date(time['year'], time['month'], time['date'], time['hours'], time['minutes'], time['seconds'])
  }

  // Functions
  // TODO: this function should be in utils file.

  static similarDictAndArrays(arrayOne, arrayTwo) {
    for (var key in arrayOne) {
      if (arrayTwo.indexOf(arrayOne[key]) > -1) {
        return true;
      }
    }
    return false
  }

  fromResolvedToUnresolvedQuestionsBothWays(resolved) {
    if (!resolved) {
      this.unresolvedQuestions = this._question.getAllUnresolvedQuestions()
    } else {
      this.unresolvedQuestions = this._question.getResolvedQuestions()
    }
  }

  updateResolvedQuestionsFromData(data) {
    var questionsDict = data.val();

    this.resolvedQuestions = [];

    for (var key in questionsDict) {
      var question = questionsDict[key];
      question["enabled"] = true;
      this.resolvedQuestions.push(question);
    }

    this.resolvedQuestions.sort(function (a, b) {
      return BrowseQuestionsPage.createDateFromQuestion(a) < BrowseQuestionsPage.createDateFromQuestion(b);
    });
  }

  getAllEnabledQuestions() {
    this.enabledQuestions = [];
    var questions = this.resolved ? this.resolvedQuestions : this.unresolvedQuestions;

    for (var i = 0; i < questions.length; i++) {
      if (BrowseQuestionsPage.similarDictAndArrays(questions[i]['genres'], this.filteredGenres) &&
        BrowseQuestionsPage.similarDictAndArrays(questions[i]['languages'], this.filteredLanguages)) {
        this.enabledQuestions.push(questions[i]);
      }
    }

    if (!this.searchQuery) {
      return this.enabledQuestions;
    }

    this.enabledQuestions = this.enabledQuestions.filter((v) => {
      if (v.title && this.searchQuery) {
        return v.title.toLowerCase().indexOf(this.searchQuery.toLowerCase()) > -1;
      }
    });
    return this.enabledQuestions;
  }
*/
  goToQuestion(questionID) {
    this.navCtrl.push(QuestionDetailsPage, questionID);
  }


  updateFilter() {
    this.questions = DictionaryHelpFunctions.updateDictionary(this.questions);
  }

  filter() {
    let filterModal = this.modalCtrl.create(FilterModalPage, this.selectedFilters);

    filterModal.onDidDismiss((data) => {
      this.selectedFilters = data;
      this.updateFilter();
    });

    filterModal.present();
  }

  doRefresh(refresher) {
    // TODO: REFRESH Location
    this.questionLoading = true;

    this._question.getAllQuestions().then(data => {
      this.questions = data.val();
      this.questionLoading = false;
    });

    refresher.complete();
  }

  isEmpty(dictionary) {
    return DictionaryHelpFunctions.isEmpty(dictionary);
  }

  order() {
    let orderAlert = this.alertCtrl.create({
      title: 'Select Order',
      inputs: [{
        type: "radio",
        label: "Friends First",
        value: "Friends",
        checked: this.orderBy == "Friends"
      }, {
        type: "radio",
        label: "Resolved First",
        value: "Resolved",
        checked: this.orderBy == "Resolved"
      }, {
        type: "radio",
        label: "Most Answers",
        value: "Answers",
        checked: this.orderBy == "Answers"
      }, {
        type: "radio",
        label: "Most Recent",
        value: "Recent",
        checked: this.orderBy == "Recent"
      }, {
        type: "radio",
        label: "Most Close to Me",
        value: "Location",
        checked: this.orderBy == "Location"
      }
      ],
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        handler: data => {
        }
      },
        {
          text: 'Apply',
          handler: data => {
            this.orderBy = data;
            this.updateFilter();
          }
        }]
    });

    orderAlert.present();
  }
}
