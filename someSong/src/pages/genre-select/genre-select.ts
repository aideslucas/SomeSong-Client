import {Component, Input, Output, EventEmitter} from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import {HomePage} from "../home/home";
import {User} from "../../providers/user";
import {Genre} from "../../providers/genre";

@Component({
  selector: 'page-genre-select',
  templateUrl: 'genre-select.html'
})
export class GenreSelectPage {
  allGenres: any;
  outPutGenres: any = new Array<number>();
  user: any;

  @Input() saveButton: boolean = true;
  @Output() selectedGenres = new EventEmitter<number>();

  constructor(public platform: Platform,
              public navCtrl: NavController,
              private _user: User,
              private _genre: Genre) {

    this._user.currentUser.first().subscribe(userData => {
      this.user = userData;

      if (userData.genres == null) {
        this.user.genres = new Array<any>();
      }
    });

    this._genre.getGenres().then(data => {
      this.allGenres = data.val();
    })
  }

  insertGenreToArray(item, genre){
    if (item.checked) {
      this.outPutGenres.push(genre);
      this.updateUserGenres();
      this.selectedGenres.emit(this.outPutGenres);
    }
    else
    {
      var index = this.outPutGenres.indexOf(genre, 0);
      if (index > -1) {
        this.outPutGenres.splice(index, 1);
      }

      this.updateUserGenres();
      this.selectedGenres.emit(this.outPutGenres);
    }
  }

  updateUserGenres(): void {
    this.user.genres = this.outPutGenres;
  }

  save() {
    this._user.updateUser(this.user);
    this.navCtrl.pop();
  }
}
