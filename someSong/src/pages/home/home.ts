import { Component } from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {User} from "../../providers/backend-service";
import {ProfilePage} from "../profile/profile";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  user: User;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,) {
    this.user = navParams.data;
  }

  goToProfile(){
    this.navCtrl.push(ProfilePage, this.user);
  }
}
