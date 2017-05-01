import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {Genres, Languages, User} from "../../providers/backend-service";
import {AuthService} from "../../providers/auth-service";

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {
  currentUser: User;

  genres = Genres;
  languages = Languages;

  constructor(public navCtrl: NavController, public navParams: NavParams, private _auth: AuthService) {
      this.currentUser = navParams.data;
  }

  logout() {
    this._auth.signOut();
  }
}
