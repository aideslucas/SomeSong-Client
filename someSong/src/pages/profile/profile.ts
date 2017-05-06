import { Component } from '@angular/core';
import {LoadingController, NavController, ModalController} from 'ionic-angular';

import {Auth} from "../../providers/auth";

import {LoginPage} from "../login/login";
import {User} from "../../providers/user";
import {Genre} from "../../providers/genre";
import {Language} from "../../providers/language";
import {GenreSelectPage} from "../genre-select/genre-select";
import {LanguageSelectPage} from "../language-select/language-select";


@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {
  currentUser: any;
  userSubscription: any;
  alertCtrl: any;

  genres: Array<any>;
  languages: Array<any>;

  constructor(public navCtrl: NavController,
              public modalCtrl: ModalController,
              private _auth: Auth,
              private _user: User,
              private _genre: Genre,
              private _language: Language)

  {
    this._genre.getGenres().then(data => {
      console.log(data.val());
      this.genres = data.val();
    });

    this._language.getLanguages().then(data => {
      this.languages = data.val();
    });


    this.userSubscription = this._user.currentUser.subscribe((data) => {
      this.currentUser = data;
    });
  }

  ionViewWillUnload() {
    this.userSubscription.unsubscribe();
  }

  goToLanguageSelect(){
    var languageModal = this.modalCtrl.create(LanguageSelectPage,  { selectedLanguages: this.currentUser.languages });
    languageModal.onDidDismiss(data => {
      this.currentUser.languages = data;
      this._user.updateUser(this.currentUser);
    });

    languageModal.present();
  }

  goToGenreSelect() {
    var genreModal = this.modalCtrl.create(GenreSelectPage,  { selectedGenres: this.currentUser.genres });
    genreModal.onDidDismiss(data => {
      this.currentUser.genres = data;
      this._user.updateUser(this.currentUser);
    });

    genreModal.present();
  }

  logout() {
    this.userSubscription.unsubscribe();
    this._user.logOut();
    this._auth.signOut();
    this.navCtrl.setRoot(LoginPage);
  }
}
