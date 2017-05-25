import { Component } from '@angular/core';
import { NavParams, Platform, ViewController} from 'ionic-angular';
import {Genre} from "../../providers/genre";
import DictionaryHelpFunctions from "../../assets/dictionaryHelpFunctions";

@Component({
  selector: 'page-genre-select',
  templateUrl: 'genre-select.html'
})
export class GenreSelectPage {
  genres = [];
  selected: {[id: string] : string};
  canLeave = false;

  constructor(params: NavParams,
              private viewController: ViewController,
              private _genre: Genre) {
    this.selected = params.get('selectedGenres');

    var selectAll = false;
    if (DictionaryHelpFunctions.isEmpty(this.selected)) {
      selectAll = true;
    }

    this._genre.getGenres().orderByValue().on('child_added', (data) => {
      this.genres.push(data);
      if (selectAll) {
        this.selected[data.key] = data.val();
      }
    });
  }

  selectAll(){
    for (let x of this.genres) {
      this.selected[x.key] = x.val();
    }
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
    this.canLeave = true;
    this.viewController.dismiss(this.selected);
  }

  ionViewCanLeave(): boolean{
    return this.canLeave;
  }
}
