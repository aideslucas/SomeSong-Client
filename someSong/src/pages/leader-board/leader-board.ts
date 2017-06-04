import {Component} from '@angular/core';
import {Score} from "../../providers/score";
import {User} from "../../providers/user";


@Component({
  selector: 'page-leader-board',
  templateUrl: 'leader-board.html'
})
export class LeaderboardPage {
  scores = {};
  user: any;
  userPosition: any;
  userPoints: any;

  constructor(private _score: Score,
              private _user: User) {
    this._user.currentUser.first().subscribe(data => {
      this.user = data;
      this._score.getScoreDetails(this.user.userID).first().subscribe((scoreDetail) => {
        this.userPoints = scoreDetail;
        this._score.getPosition(data.userID).then(data => {
          this.userPosition = data;
        });
      });
    });

    this._score.getAllScores().orderByValue().limitToLast(10).on('child_added', (data) => {
      this._user.getUser(data.key).then(user => {
        if (user) {
          this.scores[data.key] = {'user': user.val().displayName,
            'score': data.val() };
        }
      });
    });
  }


  userInTopTen() {
    if (this.userPosition) {
      return (this.userPosition <= 10);
    }

    return false;
  }
}
