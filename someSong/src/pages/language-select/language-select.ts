import { Component } from '@angular/core';
import { NavController,NavParams, Platform } from 'ionic-angular';
import {BackendService, Languages, User} from '../../providers/backend-service';
import {GenreSelectPage} from "../genre-select/genre-select";

@Component({
  selector: 'page-language-select',
  templateUrl: 'language-select.html'
})
export class LanguageSelectPage {
  languages = Languages;
  languagesKeys: any;
  user: User;

  constructor(public platform: Platform,
              public navCtrl: NavController,
              public navParams: NavParams,
              private _backend: BackendService) {
    this.languagesKeys = Object.keys(this.languages).filter(Number);
    this.user = navParams.data;
  }

  insertLanguageToArray(item, language){
    if (item.checked)
    {
      this.user.languages.push(language);
    }
    else
    {
      var index = this.user.languages.indexOf(language, 0);
      if (index > -1) {
        this.user.languages.splice(index, 1);
      }
    }
  }

  save()
  {
    this._backend.saveUser(this.user);
    this.navCtrl.push(GenreSelectPage, this.user)
  }

}
