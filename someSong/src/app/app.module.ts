import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';

// Pages
import { HomePage } from '../pages/home/home';
import { BrowseQuestionsPage } from '../pages/browse-questions/browse-questions';
import { ProfilePage } from '../pages/profile/profile';
import { AskQuestionPage } from '../pages/ask-question/ask-question';
import { QuestionDetailsPage } from '../pages/question-details/question-details';
import { RegisterPage } from "../pages/register/register";
import { LoginPage } from '../pages/login/login';
import { LanguageSelectPage } from '../pages/language-select/language-select';
import { GenreSelectPage } from '../pages/genre-select/genre-select';

// Ionic Native
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Facebook } from "@ionic-native/facebook";
import { File } from "@ionic-native/file";
import { MediaPlugin } from "@ionic-native/media";

// Providers
import { Auth } from '../providers/auth';

// Firebase
import firebase from 'firebase'
import {User} from "../providers/user";
import {Question} from "../providers/question";
import {Answer} from "../providers/answer";
import {Genre} from "../providers/genre";
import {Language} from "../providers/language";
export const firebaseConfig = {
  apiKey: "AIzaSyA_MquO5E-MQKjnEdaEUC-fnEXENMjz6Ro",
  authDomain: "somesong-700c4.firebaseapp.com",
  databaseURL: "https://somesong-700c4.firebaseio.com",
  projectId: "somesong-700c4",
  storageBucket: "somesong-700c4.appspot.com",
  messagingSenderId: "655905548469"
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    BrowseQuestionsPage,
    ProfilePage,
    AskQuestionPage,
    QuestionDetailsPage,
    LoginPage,
    LanguageSelectPage,
    GenreSelectPage,
    RegisterPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    BrowseQuestionsPage,
    ProfilePage,
    AskQuestionPage,
    QuestionDetailsPage,
    LoginPage,
    LanguageSelectPage,
    GenreSelectPage,
    RegisterPage
  ],
  providers: [
    Auth,
    User,
    Question,
    Answer,
    Genre,
    Language,
    StatusBar,
    SplashScreen,
    Facebook,
    File,
    MediaPlugin,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {
  constructor() {
    firebase.initializeApp(firebaseConfig);
  }
}
