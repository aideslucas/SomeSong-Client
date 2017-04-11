import { Component } from '@angular/core';
import { NavController,NavParams, Platform } from 'ionic-angular';
import {BackendService, Genres, User} from '../../providers/backend-service';
import {HomePage} from "../home/home";

@Component({
  selector: 'page-genre-select',
  templateUrl: 'genre-select.html'
})
export class GenreSelectPage {
  genres = Genres;
  genresKeys: any;
  user: User;

  constructor(public platform: Platform,
              public navCtrl: NavController,
              public navParams: NavParams,
              private _backend: BackendService) {
    this.genresKeys = Object.keys(this.genres).filter(Number);
    this.user = navParams.data;
    console.log(this.user);
  }

  insertGenreToArray(item, genre){
    var index = this.user.genres.indexOf(genre, 0);

    if (item.checked)
    {
      if (index == -1) {
        this.user.genres.push(genre);
      }
    }
    else
    {
      if (index > -1) {
        this.user.genres.splice(index, 1);
      }
    }
  }

  save()
  {
    this.navCtrl.setRoot(HomePage, this.user)
  }
}
