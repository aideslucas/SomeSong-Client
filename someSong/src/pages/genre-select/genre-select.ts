import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import {HomePage} from "../home/home";
import {User} from "../../providers/user";
import {Genre} from "../../providers/genre";

@Component({
  selector: 'page-genre-select',
  templateUrl: 'genre-select.html'
})
export class GenreSelectPage {
  genres: any;
  user: any;

  constructor(public platform: Platform,
              public navCtrl: NavController,
              private _user: User,
              private _genre: Genre) {
    var subscription = this._user.currentUser.subscribe(data =>
    {
      this.user = data;
      subscription.unsubscribe();
    });

    this._genre.getGenres().then(data => {
      this.genres = data.val();
    })

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
    this._user.saveUser(this.user);
    this.navCtrl.setRoot(HomePage);
  }
}
