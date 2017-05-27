import {Component, ViewChild} from '@angular/core';
import { LoadingController, Nav, Platform} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import {LoginPage} from "../pages/login/login";
import {Deeplinks} from "@ionic-native/deeplinks";
import {Auth} from "../providers/auth";
import {HomePage} from "../pages/home/home";
import {User} from "../providers/user";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;

  @ViewChild(Nav) navChild:Nav;

  constructor(public platform: Platform,
              public loadingCtrl: LoadingController,
              public statusBar: StatusBar,
              public splashScreen: SplashScreen,
              public auth: Auth,
              public _user: User,
              private deeplinks: Deeplinks)
  {
    let loading = this.loadingCtrl.create({
      content: 'Please Wait...'
    });

    loading.present();

    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      var authStateChanged = this.auth.authState.onAuthStateChanged(authUser => {
        if (authUser != null) {
          this._user.logIn(authUser.uid);
          this.rootPage = HomePage;
        } else {
          this.rootPage = LoginPage;
        }

        loading.dismiss();

        authStateChanged();
      });
    });
  }
}
