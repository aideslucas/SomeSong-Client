import {Component, ViewChild} from '@angular/core';
import { LoadingController, Nav, Platform} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import {LoginPage} from "../pages/login/login";
import {Deeplinks} from "@ionic-native/deeplinks";
import {Auth} from "../providers/auth";
import {HomePage} from "../pages/home/home";
import {User} from "../providers/user";
import {QuestionDetailsPage} from "../pages/question-details/question-details";
import {AskQuestionPage} from "../pages/ask-question/ask-question";
import {FacebookShare} from "../providers/facebook-share";

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
              private deeplinks: Deeplinks,
              private facebookShare: FacebookShare)
  {
    let loading = this.loadingCtrl.create({
      content: 'Please Wait...'
    });

    loading.present();

    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      let routes = {
        'home': HomePage,
        'question/:questionID': QuestionDetailsPage,
        'askQuestion': AskQuestionPage,

        '/home': HomePage,
        '/question/:questionID': QuestionDetailsPage,
        '/askQuestion': AskQuestionPage
      }

      var authStateChanged = this.auth.authState.onAuthStateChanged(authUser => {
        if (authUser != null) {
          this._user.logIn(authUser.uid);

          this.facebookShare.inviteFriends().then((data) => {
          }).catch((err) => {
          });

          this.rootPage = HomePage;

          this.deeplinks.route(routes).subscribe(
            match => {
              this.navChild.push(match.$route, match.$args, { animate: false, animation: "none" });
            }, (nomatch) => {
            }, () => {
            });

        } else {
          this.rootPage = LoginPage;
        }

        loading.dismiss();

        authStateChanged();
      });
    });
  }
}
