import { Component } from '@angular/core';
import {LoadingController, NavController, ModalController, AlertController} from 'ionic-angular';

import {Auth} from "../../providers/auth";

import {LoginPage} from "../login/login";
import {User} from "../../providers/user";
import {GenreSelectPage} from "../genre-select/genre-select";
import {LanguageSelectPage} from "../language-select/language-select";

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {
  currentUser: any;
  userSubscription: any;

  constructor(public navCtrl: NavController,
              public modalCtrl: ModalController,
              public alertCtrl: AlertController,
              private _auth: Auth,
              private _user: User)

  {
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

  confirmLogout() {
   let confirmModal = this.alertCtrl.create({
   // let alert = this.alertCtrl.create({
      title: 'Confirm Log Out',
      message: 'Are you sure you want to log out?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Log Out',
          handler: () => {
            console.log('Logged out');
            this.logout();
          }
        }
      ]
    });
    confirmModal.present();
  }

  logout() {
    this.userSubscription.unsubscribe();
    this._user.logOut();
    this._auth.signOut();
    this.navCtrl.setRoot(LoginPage);
  }
}
