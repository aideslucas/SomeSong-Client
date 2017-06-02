import {Component} from '@angular/core';
import {AlertController, ModalController, NavController, NavParams} from 'ionic-angular';
import {Question} from "../../providers/question";
import {QuestionDetailsPage} from "../question-details/question-details";
import {Genre} from "../../providers/genre";
import {Language} from "../../providers/language";
import {FilterModalPage} from "../filter-modal/filter-modal";
import {User} from "../../providers/user";
import DictionaryHelpFunctions from "../../assets/dictionaryHelpFunctions";
import {AskQuestionPage} from "../ask-question/ask-question";
import {Geolocation} from "@ionic-native/geolocation";

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
    selectedLocation: {
      max: "All",
      dist: {}
    },
    selectedTitle: ""
  };

  questions: { [id: string]: any } = {};
  questionLoading = true;
  orderBy: any = "";

  distances = {};
  currentLocation: any;

  constructor(public navCtrl: NavController,
              private modalCtrl: ModalController,
              public alertCtrl: AlertController,
              private geolocation: Geolocation,
              private _user: User,
              private _question: Question) {
    this._user.currentUser.first().subscribe(data => {
      this.selectedFilters.selectedLanguages = data.languages;
      this.selectedFilters.selectedGenres = data.genres;
    });

    this.getLocationAndQuestions();
  }

  getLocationAndQuestions() {
    this.geolocation.getCurrentPosition({enableHighAccuracy: true, timeout: 2000}).then((data) => {
      this.currentLocation = data.coords;

      this._question.getAllQuestions().then(data => {
        this.questions = data.val();

        for (let quest of Object.keys(data.val())) {
          this.distances[quest] = this.calculateDistance(this.questions[quest].coordinates);
        }

        this.selectedFilters.selectedLocation.dist = this.distances;

        this.questionLoading = false;
      });
    }).catch((err) => {
      this._question.getAllQuestions().then(data => {
        this.questions = data.val();

        for (let quest of Object.keys(data.val())) {
          this.distances[quest] = this.calculateDistance(this.questions[quest].coordinates);
        }

        this.selectedFilters.selectedLocation.dist = this.distances;

        this.questionLoading = false;
      });
    });
  }

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
    this.questionLoading = true;

    this.getLocationAndQuestions();

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
            this.updateFilter();
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
      var Δφ = (questionCoords.latitude-this.currentLocation.latitude) * (Math.PI / 180);
      var Δλ = (questionCoords.longitude-this.currentLocation.longitude) * (Math.PI / 180);

      var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ/2) * Math.sin(Δλ/2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

      var d = R * c;

      return d;
    }
    return 9999999;
  }
}
