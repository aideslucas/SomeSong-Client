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
  genres: any;
  selected: any;

  constructor(params: NavParams,
              private viewController: ViewController,
              private _genre: Genre) {
    this.selected = params.get('selectedGenres');
    console.log(this.selected);

    this._genre.getGenres().then(data => {
      this.genres = data.val();
    })
  }

  insertGenreToArray(item, genre){
    if (item.checked)
    {
      this.selected.push(genre);
    }
    else
    {
      var index = this.selected.indexOf(genre, 0);
      if (index > -1) {
        this.selected.splice(index, 1);
      }
    }
  }

  save()
  {
    this.viewController.dismiss(this.selected);
  }
}
