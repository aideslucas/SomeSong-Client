import {Component} from '@angular/core';
import {AlertController, ModalController, NavController, NavParams} from 'ionic-angular';
import {Question} from "../../providers/question";
import {QuestionDetailsPage} from "../question-details/question-details";
import {FilterModalPage} from "../filter-modal/filter-modal";
import {User} from "../../providers/user";
import {AskQuestionPage} from "../ask-question/ask-question";
import {Geolocation} from "@ionic-native/geolocation";
import DictionaryHelpFunctions from "../../assets/dictionaryHelpFunctions";

@Component({
  selector: 'page-browse-questions',
  templateUrl: 'browse-questions.html'
})
export class BrowseQuestionsPage {
  distances = {};

  selectedFilters = {
    selectedLanguages: {},
    selectedGenres: {},
    selectedAnswers: "All",
    selectedFriends: "All",
    selectedLocation: {
      max: "All",
      dist: this.distances
    },
    selectedTitle: ""
  };

  questions: {[id: string]: any} = {};
  questionLoading = true;

  orderBy: any = "";
  currentLocation: any;

  constructor(public navCtrl: NavController,
              private params: NavParams,
              private modalCtrl: ModalController,
              public alertCtrl: AlertController,
              private geolocation: Geolocation,
              private _user: User,
              private _question: Question) {
    let paramsLang = this.params.get("language");
    if (paramsLang != null) {
      this.selectedFilters.selectedLanguages[paramsLang.key] = paramsLang.value;
    }

    let paramsGenre = this.params.get("genre");
    if (paramsGenre != null) {
      this.selectedFilters.selectedGenres[paramsGenre.key] = paramsGenre.value;
    }

    this._user.currentUser.first().subscribe(data => {
      if (DictionaryHelpFunctions.isEmpty(this.selectedFilters.selectedLanguages))
        this.selectedFilters.selectedLanguages = data.languages;
      if (DictionaryHelpFunctions.isEmpty(this.selectedFilters.selectedGenres))
        this.selectedFilters.selectedGenres = data.genres;
    });

    this.questionLoading = false;

    this._question.getAllQuestions().on('child_added', question => {
      this._question.getQuestionDetails(question.key).subscribe((questionDetail) => {
        if (questionDetail) {
          this.questions[question.key] = questionDetail;
          this.distances[question.key] = this.calculateDistance(questionDetail.coordinates);
        }
      });
    });

    this._question.getAllQuestions().on('child_removed', question => {
      delete this.questions[question.key];
      delete  this.distances[question.key];
    });

    this.getLocation();
  }

  getLocation() {
    this.geolocation.getCurrentPosition({enableHighAccuracy: true, timeout: 2000}).then((data) => {
      this.currentLocation = data.coords;
      for (let quest of Object.keys(this.questions)) {
        this.distances[quest] = this.calculateDistance(this.questions[quest].coordinates);
      }
    });
  }

  goToQuestion(questionID) {
    this.navCtrl.push(QuestionDetailsPage, questionID);
  }

  filter() {
    let filterModal = this.modalCtrl.create(FilterModalPage, this.selectedFilters);

    filterModal.onDidDismiss((data) => {
      this.selectedFilters = data;
    });

    filterModal.present();
  }

  doRefresh(refresher) {
    this.getLocation();
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
        checked: this.orderBy == this.distances
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
            if (data == "Location") {
              this.orderBy = this.distances;
            }
            else
              this.orderBy = data;
          }
        }]
    });

    orderAlert.present();
  }

  askAQuestion() {
    this.navCtrl.push(AskQuestionPage);
  }

  calculateDistance(questionCoords) {
    if (questionCoords && this.currentLocation) {
      var R = 6371e3; // metres
      var φ1 = this.currentLocation.latitude * (Math.PI / 180);
      var φ2 = questionCoords.latitude * (Math.PI / 180);
      var Δφ = (questionCoords.latitude - this.currentLocation.latitude) * (Math.PI / 180);
      var Δλ = (questionCoords.longitude - this.currentLocation.longitude) * (Math.PI / 180);

      var a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      var d = R * c;

      return d;
    }
    return 9999999;
  }
}
