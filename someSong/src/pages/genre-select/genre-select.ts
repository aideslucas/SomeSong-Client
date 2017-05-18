import { Component } from '@angular/core';
import {NavController, NavParams, Platform, ViewController} from 'ionic-angular';
import {HomePage} from "../home/home";
import {User} from "../../providers/user";
import {Genre} from "../../providers/genre";

@Component({
  selector: 'page-genre-select',
  templateUrl: 'genre-select.html'
})
export class GenreSelectPage {
  genres = [];
  selected: {[id: string] : string};

  constructor(params: NavParams,
              private viewController: ViewController,
              private _genre: Genre) {
    this.selected = params.get('selectedGenres');

    this._genre.getGenres().orderByValue().on('child_added', (data) => {
      this.genres.push(data);
    });
  }

  insertGenreToArray(item, genre){
    if (item.checked)
    {
      this.selected[genre.key] = genre.val();
    }
    else
    {
      delete this.selected[genre.key];
    }
  }

  save()
  {
    this.viewController.dismiss(this.selected);
  }
}
