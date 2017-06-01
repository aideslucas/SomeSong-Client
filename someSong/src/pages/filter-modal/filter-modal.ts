import {Component} from '@angular/core';
import {AlertController, ModalController, NavParams, ViewController} from 'ionic-angular';
import {LanguageSelectPage} from "../language-select/language-select";
import {GenreSelectPage} from "../genre-select/genre-select";
import DictionaryHelpFunctions from "../../assets/dictionaryHelpFunctions";

@Component({
  selector: 'page-filter-modal',
  templateUrl: 'filter-modal.html'
})
export class FilterModalPage {
  selectedFilters: any;

  constructor(private viewController: ViewController,
              private navParams: NavParams,
              private modalCtrl: ModalController,
              private alertCtrl: AlertController) {
    this.selectedFilters = this.navParams.data;
  }

  selectLocation() {
    let locationAlert = this.alertCtrl.create({
      title: 'Select Location Range',
      inputs: [{
        type: "radio",
        label: "Within 10KM",
        value: "10",
        checked: this.selectedFilters.selectedLocation.max == "10"
      }, {
        type: "radio",
        label: "Within 50KM",
        value: "50",
        checked: this.selectedFilters.selectedLocation.max == "50"
      }, {
        type: "radio",
        label: "Within 100KM",
        value: "100",
        checked: this.selectedFilters.selectedLocation.max == "100"
      }, {
        type: "radio",
        label: "Within 1000KM",
        value: "1000",
        checked: this.selectedFilters.selectedLocation.max == "1000"
      }, {
        type: "radio",
        label: "All Ranges",
        value: "All",
        checked: this.selectedFilters.selectedLocation.max == "All"
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
            this.selectedFilters.selectedLocation.max = data;
          }
        }]
    });

    locationAlert.present();
  }

  selectAnswers() {
    let answersAlert = this.alertCtrl.create({
      title: 'Select Answers',
      inputs: [{
        type: "radio",
        label: "Resolved Questions",
        value: "Resolved",
        checked: this.selectedFilters.selectedAnswers == "Resolved"
      }, {
        type: "radio",
        label: "Unsolved Questions",
        value: "Unresolved",
        checked: this.selectedFilters.selectedAnswers == "Unresolved"
      }, {
        type: "radio",
        label: "Only Questions With Answers",
        value: "WithAnswers",
        checked: this.selectedFilters.selectedAnswers == "WithAnswers"
      }, {
        type: "radio",
        label: "All Questions",
        value: "All",
        checked: this.selectedFilters.selectedAnswers == "All"
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
            this.selectedFilters.selectedAnswers = data;
          }
        }]
    });

    answersAlert.present();
  }

  selectFriends() {
    let friendsAlert = this.alertCtrl.create({
      title: 'Select Friends',
      inputs: [{
        type: "radio",
        label: "Only Friends Questions",
        value: "Friends",
        checked: this.selectedFilters.selectedFriends == "Friends"
      },
        {
          type: "radio",
          label: "All Questions",
          value: "All",
          checked: this.selectedFilters.selectedFriends == "All"
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
            this.selectedFilters.selectedFriends = data;
          }
        }]
    });

    friendsAlert.present();
  }

  selectGenres() {
    let genresModal = this.modalCtrl.create(GenreSelectPage, {selectedGenres: this.selectedFilters.selectedGenres});

    genresModal.onDidDismiss((data) => {
      this.selectedFilters.selectedGenres = data;
      this.selectedFilters.selectedGenres = DictionaryHelpFunctions.updateDictionary(this.selectedFilters.selectedGenres);
    });

    genresModal.present();
  }

  selectLanguages() {
    let languagesModal = this.modalCtrl.create(LanguageSelectPage, {selectedLanguages: this.selectedFilters.selectedLanguages});

    languagesModal.onDidDismiss((data) => {
      this.selectedFilters.selectedLanguages = data;
      this.selectedFilters.selectedLanguages = DictionaryHelpFunctions.updateDictionary(this.selectedFilters.selectedLanguages);
    });

    languagesModal.present();
  }

  clear() {
    this.selectedFilters = this.navParams.data;
  }

  cancel() {
    this.clear();
    this.apply();
  }

  apply() {
    this.viewController.dismiss(this.selectedFilters);
  }
}
