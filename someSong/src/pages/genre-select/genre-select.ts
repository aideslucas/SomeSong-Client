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
    this._user.currentUser.first().subscribe(data =>
    {
      this.user = data;

      if (this.user.genres == null) {
        this.user.genres = new Array<any>();
      }
    });

    this._genre.getGenres().then(data => {
      this.genres = data.val();
    })
  }

  insertGenreToArray(item, genre){
    if (item.checked)
    {
      this.user.genres.push(genre);
    }
    else
    {
      var index = this.user.genres.indexOf(genre, 0);
      if (index > -1) {
        this.user.genres.splice(index, 1);
      }
    }
  }

  save()
  {
    this._user.updateUser(this.user);
    this.navCtrl.pop();
  }
}
