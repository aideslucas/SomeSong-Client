import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { BrowseQuestionsPage } from '../pages/browse-questions/browse-questions';
import { ProfilePage } from '../pages/profile/profile';
import { AskQuestionPage } from '../pages/ask-question/ask-question';
import { QuestionDetailsPage } from '../pages/question-details/question-details';

import { LoginPage } from '../pages/login/login';
import { LanguageSelectPage } from '../pages/language-select/language-select';
import { GenreSelectPage } from '../pages/genre-select/genre-select';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AngularFireModule } from 'angularfire2';
import { AuthService } from '../providers/auth-service';
import { BackendService } from '../providers/backend-service';
import { Facebook } from "@ionic-native/facebook";


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
    ListPage,
    BrowseQuestionsPage,
    ProfilePage,
    AskQuestionPage,
    QuestionDetailsPage,
    LoginPage,
    LanguageSelectPage,
    GenreSelectPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    BrowseQuestionsPage,
    ProfilePage,
    AskQuestionPage,
    QuestionDetailsPage,
    LoginPage,
    LanguageSelectPage,
    GenreSelectPage
  ],
  providers: [
    AuthService,
    BackendService,
    StatusBar,
    SplashScreen,
    Facebook,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
