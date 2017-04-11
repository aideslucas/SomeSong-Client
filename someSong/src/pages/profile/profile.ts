import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {Genres, Languages, User} from "../../providers/backend-service";

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {
  currentUser: User;

  genres = Genres;
  languages = Languages;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
      this.currentUser = navParams.data;
  }
}
