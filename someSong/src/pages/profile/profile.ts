import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {BackendService, Genres, Languages, User} from "../../providers/backend-service";
import {AuthService} from "../../providers/auth-service";
import {LoginPage} from "../login/login";

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {
  currentUser: any;
  userSubscription: any;

  genres = Genres;
  languages = Languages;

  constructor(public navCtrl: NavController, private backEnd: BackendService, private _auth: AuthService) {
    this.currentUser = {
      genres: new Array<any>(),
      languages: new Array<any>()
    };

      this.userSubscription = this.backEnd.getCurrentUser().subscribe((data) => {
        this.currentUser = data;
      });
  }

  logout() {
    this.userSubscription.unsubscribe();
    this._auth.signOut();
    this.navCtrl.setRoot(LoginPage);
  }
}
