import { Component } from '@angular/core';
import {NavParams, ViewController} from 'ionic-angular';

import {Language} from "../../providers/language";

@Component({
  selector: 'page-language-select',
  templateUrl: 'language-select.html'
})
export class LanguageSelectPage {
  languages = [];
  selected : {[id: string] : string};

  constructor(params: NavParams,
              private viewController: ViewController,
              private _language: Language) {
    this.selected= params.get('selectedLanguages');

    this._language.getLanguages().orderByValue().on('child_added', (data) => {
      this.languages.push(data);
    });
  }

  insertLanguageToArray(item, language){
    if (item.checked)
    {
      this.selected[language.key] = language.val();
    }
    else
    {
      delete this.selected[language.key];
    }
  }

  save()
  {
    this.viewController.dismiss(this.selected);
  }

}
