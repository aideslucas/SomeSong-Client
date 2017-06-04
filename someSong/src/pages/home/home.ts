import {ChangeDetectorRef, Component} from '@angular/core';
import {AlertController, NavController} from 'ionic-angular';

import {ProfilePage} from "../profile/profile";
import {QuestionDetailsPage} from "../question-details/question-details";
import {AskQuestionPage} from "../ask-question/ask-question";
import {BrowseQuestionsPage} from "../browse-questions/browse-questions";

import {User} from "../../providers/user";
import {Answer} from "../../providers/answer";
import {Question} from "../../providers/question";
import DictionaryHelpFunctions from "../../assets/dictionaryHelpFunctions";

import {Push, PushObject, PushOptions} from '@ionic-native/push'
import {LeaderboardPage} from "../leader-board/leader-board";
import {Deletes} from "../../providers/deletes";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  questionLoading = true;
  answerLoading = true;

  user: any;
  userQuestions: { [id: string]: any } = {};
  userAnswers = {};
  userSubscription: any;

  constructor(public navCtrl: NavController,
              private ref: ChangeDetectorRef,
              private alertCtrl: AlertController,
              private _user: User,
              private _answer: Answer,
              private _question: Question,
              private _deletes: Deletes,
              private _push: Push) {
    console.log("ABCABC got to home ");
    if (this._user.currentUser) {
      this.userSubscription = this._user.currentUser.subscribe((data) => {
        this.user = data;
        console.log("ABCABC got to user ");
        this.initPushNotifications();
        console.log("ABCABC got to push ");
        if (!this.user.questions) {
          this.questionLoading = false;
        }
        else {
          let numQuestions = Object.keys(this.user.questions).length;
          let loadedQuestions = 0;

          this._user.getUserQuestions(this.user.userID).on('child_added', userQuestion => {
            this._question.getQuestionDetails(userQuestion.key).subscribe((questionDetail) => {
              if (questionDetail) {
                this.userQuestions[userQuestion.key] = questionDetail;
              }
              loadedQuestions++;

              if (loadedQuestions == numQuestions)
                this.questionLoading = false;
            });
          });

          this._user.getUserQuestions(this.user.userID).on('child_removed', userQuestion => {
            delete this.userQuestions[userQuestion.key];
          });
        }


        if (!this.user.answers) {
          this.answerLoading = false;
        }

        else {
          let numAnswers = Object.keys(this.user.answers).length;
          let loadedAnswers = 0;

          this._user.getUserAnswers(this.user.userID).on('child_added', userAnswer => {
            this._answer.getAnswerDetails(userAnswer.key).subscribe((answerDetail) => {
              if (answerDetail) {
                this.userAnswers[userAnswer.key] = answerDetail;
                this._question.getQuestionDetails(answerDetail.question).subscribe((questionDetail) => {
                  if (questionDetail) {
                    this.userAnswers[userAnswer.key].question = questionDetail;
                  }

                });
              }

              loadedAnswers++;

              if (loadedAnswers == numAnswers)
                this.answerLoading = false;
            });
          });

          this._user.getUserAnswers(this.user.userID).on('child_removed', userAnswer => {
            if (userAnswer) {
              delete this.userAnswers[userAnswer.key];
            }
          });
        }
      });
    }
  }

  initPushNotifications() {
    const options: PushOptions = {
      android: {
        senderID: '655905548469'
      },
      ios: {
        alert: 'true',
        badge: true,
        sound: 'false'
      },
      windows: {}
    };

    const pushObject: PushObject = this._push.init(options);

    pushObject.on('notification').subscribe((notification: any) => {
      if (notification.additionalData.foreground) {
        // if application open, show popup
        let notificationAlert = this.alertCtrl.create({
          title: notification.title,
          message: notification.message,
          buttons: [{
            text: 'Ignore',
            role: 'cancel'
          }, {
            text: 'View',
            handler: () => {
              this.navCtrl.push(QuestionDetailsPage, notification.additionalData.questionID);
            }
          }]
        });

        notificationAlert.present();
      } else {
        this.navCtrl.push(QuestionDetailsPage, notification.additionalData.questionID);
      }
    });

    pushObject.on('registration').subscribe((registration: any) => {
      this.user.token = registration.registrationId;
      this._user.updateUser(this.user);
    });

    pushObject.on('error').subscribe(error => alert('Error with Push plugin' + JSON.stringify(error)));
  }

  isEmpty(dictionary) {
    return DictionaryHelpFunctions.isEmpty(dictionary);
  }

  goToProfile() {
    this.navCtrl.push(ProfilePage);
  }

  goToQuestion(questionID) {
    this.navCtrl.push(QuestionDetailsPage, questionID);
  }

  askAQuestion() {
    this.navCtrl.push(AskQuestionPage);
  }

  browseQuestions() {
    this.navCtrl.push(BrowseQuestionsPage);
  }

  deleteAnswer(item, answer) {
    item.close();

    let confirmAlert = this.alertCtrl.create({
      title: "Are you sure?",
      subTitle: "Are you sure you want to delete this answer: " + answer.content,
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
          }
        },
        {
          text: 'Confirm',
          handler: () => {
            this._deletes.deleteAnswer(answer);
          }
        }
      ]
    });

    confirmAlert.present();
  }

  deleteQuestion(item, question) {
    item.close();

    let confirmAlert = this.alertCtrl.create({
      title: "Are you sure?",
      subTitle: "Are you sure you want to delete this question: " + question.title,
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
          }
        },
        {
          text: 'Confirm',
          handler: () => {
            this._deletes.deleteQuestion(question);
          }
        }
      ]
    });

    confirmAlert.present();
  }

  ionViewWillUnload() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  goToLeaderboard(){
    this.navCtrl.push(LeaderboardPage);
  }
}
